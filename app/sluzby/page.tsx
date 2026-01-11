import React from "react";
import type { Metadata } from 'next';
import Services from "../../components/Services";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartSidebar from "../../components/CartSidebar";

// =================================================================
// METADATA
// =================================================================
export const metadata: Metadata = {
    title: 'Služby a ceny | Bolevecké květiny',
    description: 'Prohlédněte si naše služby a cenové balíčky. Malé, střední i velké kytice pro každou příležitost.',
    alternates: { canonical: 'https://ixiakvetiny.free.nf/sluzby', },
};

// =================================================================
// STRÁNKA SLUŽBY
// =================================================================
export default function ServicesPage() {
    return (
        <div className="font-sans scroll-smooth relative">
            <Navbar />

            <main className="pt-24">
                <Services />
            </main>

            <Footer />

            {/* --- CART SIDEBAR --- */}
            <CartSidebar />
        </div>
    );
}
