import React from "react";
import type { Metadata } from 'next';
import FlowerCare from "../../components/FlowerCare";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartSidebar from "../../components/CartSidebar";

// =================================================================
// METADATA
// =================================================================
export const metadata: Metadata = {
    title: 'Péče o květiny | Bolevecké květiny',
    description: 'Naučte se správně pečovat o řezané květiny. Tipy a rady pro prodloužení jejich života a krásy.',
    alternates: { canonical: 'https://bolevecketest.netlify.app/pece-o-kvetiny', },
};

// =================================================================
// STRÁNKA PÉČE O KVĚTINY
// =================================================================
export default function FlowerCarePage() {
    return (
        <div className="font-sans scroll-smooth relative">
            <Navbar />

            <main className="pt-24">
                <FlowerCare />
            </main>

            <Footer />

            {/* --- CART SIDEBAR --- */}
            <CartSidebar />
        </div>
    );
}
