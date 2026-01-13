"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
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
                    setTimeout(() => {
                        setStatus("");
                    }, 3000);
                },
                (error) => {
                    console.log(error.text);
                    setStatus("Chyba při odesílání. Zkuste to prosím znovu.");
                }
            );
    };

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-6">
                        Kontaktujte nás
                    </h1>
                    <p className="text-xl text-stone-600 leading-relaxed">
                        Máte dotaz nebo zájem o naše služby? Rádi vám poradíme a pomůžeme s výběrem.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                    {/* Kontaktní informace */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white rounded-lg shadow-lg p-8 h-full border-t-4 border-green-600">
                            <h2 className="text-2xl font-bold text-stone-900 mb-6">Kde nás najdete</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-700">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-1">Adresa</h3>
                                        <p className="text-stone-600">Plaská 2583/198</p>
                                        <p className="text-stone-600">323 00 Plzeň 1</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-700">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-1">Telefon</h3>
                                        <a href="tel:+420373315413" className="text-green-700 hover:text-green-800 font-medium">
                                            +420 373 315 413
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-700">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-1">Otevírací doba</h3>
                                        <p className="text-stone-600">Pondělí - Neděle: 9:00 – 17:30</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Kontaktní formulář */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white rounded-lg shadow-lg p-8 h-full border-t-4 border-green-600">
                            <h2 className="text-2xl font-bold text-stone-900 mb-6">Napište nám</h2>

                            <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="user_name" className="block text-sm font-medium text-stone-700 mb-2">
                                        Vaše jméno
                                    </label>
                                    <input
                                        type="text"
                                        id="user_name"
                                        name="user_name"
                                        required
                                        className="w-full p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-stone-800 bg-stone-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="user_email" className="block text-sm font-medium text-stone-700 mb-2">
                                        Váš email
                                    </label>
                                    <input
                                        type="email"
                                        id="user_email"
                                        name="user_email"
                                        required
                                        className="w-full p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-stone-800 bg-stone-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                                        Vaše zpráva
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        className="w-full p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-stone-800 bg-stone-50 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition shadow-md mt-2"
                                >
                                    Odeslat zprávu
                                </button>

                                {status && (
                                    <p className={`text-center font-medium ${status.includes("Chyba") ? "text-red-600" : "text-green-700"}`}>
                                        {status}
                                    </p>
                                )}
                            </form>
                        </div>
                    </motion.div>

                </div>

                {/* MAPA - Celá šířka pod kontakty a formulářem */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-600">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2576.291307344736!2d13.380614377183498!3d49.78058657147202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470af17f1afe6ce1%3A0xbae7ce35df946161!2zQm9sZXZlY2vDqSBLdsSbdGlueQ!5e0!3m2!1scs!2scz!4v1768143574845!5m2!1scs!2scz"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mapa Bolevecké květiny"
                            ></iframe>
                        </div>
                    </div>
                </motion.div>

                {/* COPYRIGHT */}
                <div className="mt-12 pt-6 border-t border-stone-200 text-center">
                    <p className="text-sm text-stone-500">
                        © 2026 Bolevecké květiny. Všechna práva vyhrazena.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default ContactPage;
