"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
// ZMĚNA: Importujeme useCart pro přístup k setIsCartOpen
import { useCart } from "../context/CartContext";

// Navbar již nepřijímá onOpenContact, protože košík otevře sám
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ZMĚNA: Vytáhneme funkci pro otevření košíku
  const { setIsCartOpen, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Domů', href: '/#home' },
    { name: 'O nás', href: '/o-nas' },
    { name: 'Služby', href: '/sluzby' },
    { name: 'Jak vybrat květiny', href: '/jak-vybrat-kvetiny' },
    { name: 'Péče o květiny', href: '/pece-o-kvetiny' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  const handleSmoothScroll = (e, href) => {
    // Pokud je odkaz ve formátu /#anchor
    if (href.startsWith('/#')) {
      const hash = href.substring(1); // Získáme #anchor
      // Pokud jsme na hlavní stránce, scrollujeme
      if (window.location.pathname === '/') {
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) {
          const yOffset = 0;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setIsOpen(false);
      }
      // Jinak necháme výchozí chování (přesměrování na /)
    } else if (href.startsWith('#')) {
      // Klasické kotvy
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        const yOffset = 0;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setIsOpen(false);
    }
    // Pro běžné odkazy (např. /o-nas) necháme výchozí chování
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${scrolled
        ? 'bg-white/5 backdrop-blur-md shadow-sm py-5'
        : 'bg-transparent py-4'
        }`}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* 1. LOGO (Div Vlevo) */}
          <a href="/#home"
            className="shrink-0 flex items-center cursor-pointer w-52"
            onClick={e => handleSmoothScroll(e, '/#home')}
          >
            <Image src="/logo.png"
              width={200}
              height={200}
              alt="Logo"
              className="object-contain"
              priority
            />
          </a>

          {/* 2. DESKTOP MENU (Div Střed) */}
          <div className="hidden xl:flex flex-grow justify-center">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-stone-600 hover:text-green-700 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
                  onClick={e => handleSmoothScroll(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* 3. CTA TLAČÍTKO (Div Vpravo) - NYNÍ OTEVÍRÁ KOŠÍK */}
          <div className="hidden xl:flex shrink-0 w-52 justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-0 bg-transparent border-none outline-none cursor-pointer"
              aria-label="Otevřít košík"
            >
              <Image
                src="/shopping-cart.png"
                alt="Košík"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              {/* Badge s počtem položek */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* 4. MOBILNÍ HAMBURGER TLAČÍTKO */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none p-2"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOBILNÍ MENU (Rozbalovací část) */}
      <div className={`xl:hidden absolute w-full bg-white border-b border-stone-100 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible top-full' : 'opacity-0 invisible -top-5'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg flex flex-col items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={e => handleSmoothScroll(e, link.href)}
              className="block px-3 py-3 text-lg font-medium text-stone-600 hover:text-green-700"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 mt-4 border-t border-stone-100 w-full flex justify-center">
            <button
              onClick={() => { setIsOpen(false); setIsCartOpen(true); }}
              className="bg-green-700 p-2 rounded-full hover:bg-green-800 transition relative"
              aria-label="Otevřít košík"
            >
              <Image
                src="/shopping-cart.png"
                alt="Košík"
                width={32}
                height={32}
                className="object-contain"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;