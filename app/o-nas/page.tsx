import React from "react";
import type { Metadata } from 'next';
import About from "../../components/About";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartSidebar from "../../components/CartSidebar";

// =================================================================
// METADATA
// =================================================================
export const metadata: Metadata = {
    title: 'O nás | Bolevecké květiny',
    description: 'Poznejte náš příběh. Jsme rodinné květinářství s láskou k přírodě a čerstvým květinám.',
    alternates: { canonical: 'https://bolevecketest.netlify.app/o-nas', },
};

// =================================================================
// STRÁNKA O NÁS
// =================================================================
export default function AboutPage() {
    return (
        <div className="font-sans scroll-smooth relative">
            <Navbar />

            <main className="pt-24">
                <About />
            </main>

            <Footer />

            {/* --- CART SIDEBAR --- */}
            <CartSidebar />
        </div>
    );
}
