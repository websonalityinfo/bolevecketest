"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// Komponenta přijímá props isOpen (zda je vidět) a onClose (funkce na zavření)
const Contact = ({ isOpen, onClose }) => {
  const formRef = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Odesílám...");

    emailjs
      .sendForm(
        "service_vgpfyqg",
        "template_oaj6skv",
        formRef.current,
        "jo32xM6J8evOvynT1"
      )
      .then(
        (result) => {
          console.log(result.text);
          setStatus("Zpráva byla úspěšně odeslána!");
          formRef.current.reset();
          // Volitelně: Zavřít okno po úspěšném odeslání po 2 sekundách
          setTimeout(() => {
            setStatus("");
            onClose();
          }, 2000);
        },
        (error) => {
          console.log(error.text);
          setStatus("Chyba při odesílání. Zkuste to prosím znovu.");
        }
      );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. POZADÍ (Backdrop) - kliknutím mimo se zavře */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-9998 backdrop-blur-sm"
          />

          {/* 2. MODÁLNÍ OKNO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white p-8 rounded-2xl shadow-2xl z-9999"
          >
            {/* Tlačítko Zavřít (Křížek) */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h2 className="text-3xl font-bold mb-2 text-green-900 text-center">Napište nám</h2>
            <p className="text-stone-500 text-center mb-6">Máte dotaz? Rádi vám poradíme.</p>

            <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="user_name"
                  placeholder="Vaše jméno"
                  required
                  className="p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-stone-800 bg-stone-50"
                />
                <input
                  type="email"
                  name="user_email"
                  placeholder="Váš email"
                  required
                  className="p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-stone-800 bg-stone-50"
                />
                <textarea
                  name="message"
                  placeholder="Vaše zpráva"
                  required
                  rows={4}
                  className="p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-stone-800 bg-stone-50 resize-none"
                ></textarea>

                <button type="submit" className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition shadow-md mt-2">
                  Odeslat zprávu
                </button>

                {status && <p className={`text-center font-medium ${status.includes("Chyba") ? "text-red-600" : "text-green-700"}`}>{status}</p>}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Contact;