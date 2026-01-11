import React from "react";
import type { Metadata } from 'next';
import ContactPage from "../../components/ContactPage";
import Navbar from "../../components/Navbar";
import CartSidebar from "../../components/CartSidebar";

// =================================================================
// METADATA
// =================================================================
export const metadata: Metadata = {
    title: 'Kontakt | Bolevecké květiny',
    description: 'Kontaktujte nás. Jsme tu pro vás. Adresa, telefon, otevírací doba a kontaktní formulář.',
    alternates: { canonical: 'https://ixiakvetiny.free.nf/kontakt', },
};

// =================================================================
// STRÁNKA KONTAKT
// =================================================================
export default function ContactPageRoute() {
    return (
        <div className="font-sans scroll-smooth relative">
            <Navbar />

            <main className="pt-24">
                <ContactPage />
            </main>

            {/* Footer odstraněn - všechny informace jsou na kontaktní stránce */}

            {/* --- CART SIDEBAR --- */}
            <CartSidebar />
        </div>
    );
}
