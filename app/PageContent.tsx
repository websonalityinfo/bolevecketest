"use client";
import React, { useState } from "react";
// Importy komponent
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Flowers from "../components/Flowers";
import Contact from "../components/Contact"; // Modální verze
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
import Footer from "../components/Footer";

// --- IMPORT PRO KOŠÍK ---
import CartSidebar from "../components/CartSidebar";

const PageContent = () => {
    // --- STAVY ---
    const [isAdminUrl, setIsAdminUrl] = React.useState(false);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
    // ZMĚNA: Přidán stav pro modální kontakt
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Funkce pro otevření modalu
    const openContactModal = () => setIsContactOpen(true);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setIsAdminUrl(window.location.search.includes("admin"));
        }
    }, []);

    // Podmíněné renderování administrace
    if (isAdminUrl) {
        return !isAdminLoggedIn ? (
            <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
        ) : (
            <AdminPanel onLogout={() => setIsAdminLoggedIn(false)} />
        );
    }

    return (
        <div className="font-sans scroll-smooth relative">

            {/* NAVIGACE: Přidáváme prop pro otevření modalu (bez classNames na Navbar) */}
            <Navbar />

            {/* MAIN: ODSTRANĚNÝ padding-top, aby se zachovalo původní ZELENÉ pozadí Navigace */}
            <main>
                <Hero />
                <Flowers />
                {/* ODSTRANĚNA: Původní statická sekce Contact */}
            </main>

            <Footer />

            {/* --- MODÁLNÍ OKNO KONTAKTU (Renderuje se s logikou) --- */}
            <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            {/* --- CART SIDEBAR --- */}
            <CartSidebar />

            {/* --- PLOVOUCÍ TLAČÍTKO "DOTAZ" --- */}
            <button
                onClick={openContactModal} // Kliknutí otevře modální okno
                className="fixed bottom-6 right-6 z-[9997] bg-green-700 text-white p-4 rounded-full shadow-2xl hover:bg-green-800 transition-transform hover:scale-110 flex items-center justify-center group"
                title="Napište nám dotaz"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h9m-9 3.75h9m1.5-13.5h-13.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 004.5 21h13.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25z" />
                </svg>

                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap font-medium">
                    Máte dotaz?
                </span>
            </button>

        </div>
    );
};

export default PageContent;