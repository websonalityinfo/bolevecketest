import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/firebase";
// PŘIDÁNO: updateDoc a increment pro odečítání ze skladu
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import emailjs from "@emailjs/nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  console.log("---------- START: Funkce verify-order spuštěna ----------");

  try {
    const { sessionId } = await req.json();
    console.log("1. Session ID přijato:", sessionId);

    if (!sessionId) return NextResponse.json({ error: "Chybí Session ID" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      console.log("CHYBA: Není zaplaceno");
      return NextResponse.json({ error: "Není zaplaceno" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", sessionId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      console.log("INFO: Objednávka už existuje, končím.");
      return NextResponse.json({ message: "Objednávka již existuje", orderId: sessionId });
    }
    
    // --- NOVÉ: LOGIKA PRO ODEČTENÍ ZE SKLADU ---
    const stockData = session.metadata?.stock_update; // Přečtení "ID:Množství;ID:Množství"
    
    if (stockData) {
        console.log("4. AKTUALIZACE SKLADU: Zpracovávám...");
        const itemsToUpdate = stockData.split(';'); 
        
        for (const itemStr of itemsToUpdate) {
            const [flowerId, quantityStr] = itemStr.split(':');
            const quantity = Number(quantityStr);

            if (flowerId && quantity > 0) {
                try {
                    const flowerRef = doc(db, "flowers", flowerId);
                    // Snížíme sklad o zakoupené množství
                    await updateDoc(flowerRef, {
                        stock: increment(-quantity)
                    });
                    console.log(` -> Odečteno ${quantity} ks u ID: ${flowerId}`);
                } catch (err) {
                    console.error(` -> CHYBA při odečítání skladu u ID ${flowerId}:`, err);
                    // Pokud je chyba (např. špatné ID), zalogujeme a pokračujeme
                }
            }
        }
    } else {
        console.log("SKLAD: Žádná data pro aktualizaci skladu.");
    }
    // ---------------------------------------------


    const customerEmail = session.customer_details?.email;
    // NOVÉ: Čteme vzkaz z metadat
    const customerNote = session.metadata?.customer_note || "Zákazník nezadal vzkaz."; 
    console.log("2. Email zákazníka:", customerEmail);

    // Uložení do DB (Zahrnuje i Vzkaz)
    await setDoc(orderRef, {
      createdAt: new Date().toISOString(),
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: "czk",
      customerName: session.customer_details?.name || "Zákazník",
      customerEmail: customerEmail || "",
      items: session.metadata?.order_items || "Neuvedeno",
      customerNote: customerNote, // <--- ULOŽENÍ VZKAZU DO DATABÁZE
      status: "new",
      fulfillmentStatus: "RECEIVED",
      stripeSessionId: sessionId
    });
    console.log("3. Uloženo do Firebase OK");

    // --- DIAGNOSTIKA EMAILJS ---
    if (customerEmail) {
      console.log("5. Pokus o odeslání e-mailu...");
      
      // Kontrola klíčů (Vypíšeme jen jestli existují, ne jejich obsah)
      console.log("   -> Klíče kontrola:", {
        Service: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? "OK" : "CHYBÍ",
        Template: process.env.EMAILJS_ORDER_TEMPLATE_ID ? "OK" : "CHYBÍ",
        Public: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "OK" : "CHYBÍ",
        Private: process.env.EMAILJS_PRIVATE_KEY ? "OK" : "CHYBÍ"
      });

      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_ORDER_TEMPLATE_ID!,
          {
            customer_name: session.customer_details?.name || "Zákazník",
            customer_email: customerEmail,
            order_id: sessionId.slice(-5).toUpperCase(),
            amount: `${session.amount_total ? session.amount_total / 100 : 0} Kč`,
            items: session.metadata?.order_items || "Neuvedeno",
            date: new Date().toLocaleDateString("cs-CZ"),
          },
          {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          }
        );
        console.log("6. SUCCESS: EmailJS odesláno!");
      } catch (err) {
        console.error("7. ERROR EmailJS selhal:", err);
      }
    } else {
        console.log("CHYBA: Email neodeslán - chybí email zákazníka ve Stripe datech");
    }

    return NextResponse.json({ success: true, orderId: sessionId });

  } catch (error: any) {
    console.error("KRITICKÁ CHYBA SERVERU:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}