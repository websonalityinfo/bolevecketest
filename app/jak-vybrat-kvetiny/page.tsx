import React from "react";
import type { Metadata } from 'next';
import FlowerGuide from "../../components/FlowerGuide";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartSidebar from "../../components/CartSidebar";

// =================================================================
// METADATA
// =================================================================
export const metadata: Metadata = {
    title: 'Jak vybrat květiny | Bolevecké květiny',
    description: 'Průvodce výběrem květin podle barev, příležitostí a osobnosti obdarovaného. Tipy pro každou situaci.',
    alternates: { canonical: 'https://bolevecketest.netlify.app/jak-vybrat-kvetiny', },
};

// =================================================================
// STRÁNKA JAK VYBRAT KVĚTINY
// =================================================================
export default function FlowerGuidePage() {
    return (
        <div className="font-sans scroll-smooth relative">
            <Navbar />

            <main className="pt-24">
                <FlowerGuide />
            </main>

            <Footer />

            {/* --- CART SIDEBAR --- */}
            <CartSidebar />
        </div>
    );
}
