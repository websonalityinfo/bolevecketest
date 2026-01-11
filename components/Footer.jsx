import React from "react";
import Image from "next/image";

const Footer = () => {
    // Zástupné kontaktní údaje
    const tel = "+420 373 315 413";
    const email = "info@boleveckekvetiny.cz";
    const adresa = "Plaská 2583/198, 323 00 Plzeň 1";

    // ZDE JE VLOŽEN VÁŠ iframe KÓD pro mapu
    const MAPA_EMBED_KÓD = (
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2576.291307344736!2d13.380614377183498!3d49.78058657147202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470af17f1afe6ce1%3A0xbae7ce35df946161!2zQm9sZXZlY2vDqSBLdsSbdGlueQ!5e0!3m2!1scs!2scz!4v1768143574845!5m2!1scs!2scz"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Bolevecké květiny"
        ></iframe>
    );

    return (
        <footer id="footer" className="bg-stone-50 border-t border-stone-200 text-stone-700">
            {/* HLAVNÍ SEKCE: Rozděleno na 2 logické sloupce (Kontakt a Mapa) */}
            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* SLOUPEC 1: KONTAKTY A ADRESA (LEVÁ STRANA) */}
                <div className="flex flex-col space-y-4">
                    <h3 className="font-semibold text-xl text-stone-800 mb-2 border-b border-rose-300 pb-1 w-max">Kontaktujte nás</h3>

                    {/* ŘÁDEK 1: TELEFON */}
                    <a href={`tel:${tel.replace(/\s/g, '')}`} className="hover:text-rose-600 transition duration-300 flex items-center">
                        <Image src="/phone-icon.png"
                            alt="ikona telefonu"
                            width={24}
                            height={24}
                            className="mr-2"
                        />
                        {tel}
                    </a>

                    {/* ŘÁDEK 2: EMAIL */}
                    <a href={`mailto:${email}`} className="hover:text-rose-600 transition duration-300 flex items-center">
                        <Image src="/mail-icon.png"
                            alt="ikona mailu"
                            width={24}
                            height={24}
                            className="mr-2"
                        />
                        {email}
                    </a>

                    {/* ŘÁDEK 3: ADRESA - ZMĚNA VELIKOSTI IKONY na 24x24 */}
                    <a className="hover:text-rose-600 transition duration-300 flex items-center" href="https://www.google.com/maps/place/Květinářství+Iveta+-+květiny+u+Pošty/@49.748164,13.37525,17z/data=!3m1!4b1!4m6!3m5!1s0x470af1fa977e5009:0xd0bb3b87e3cac70f!8m2!3d49.748164!4d13.37525!16s%2Fg%2F11btm9kyr5?entry=ttu&g_ep=EgoyMDI1MTEzMC4wIKXMDSoASAFQAw%3D%3D">
                        <Image src="/adress-icon.png"
                            alt="ikona adresy"
                            width={24} // ZMĚNA Z 28 na 24
                            height={24} // ZMĚNA Z 28 na 24
                            className="mr-2" // Mezera zůstává stejná
                        />
                        {adresa}
                    </a>

                    {/* OTEVÍRACÍ HODINY */}
                    <div className="mt-6 pt-4 border-t border-stone-200">
                        <h4 className="font-semibold text-lg text-stone-800 mb-3">Otevírací doba</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-stone-600">Pondělí - Neděle:</span>
                                <span className="font-medium text-stone-800">9:00 – 17:30</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLOUPEC 2: MAPA A LOKACE (PRAVÁ STRANA) */}
                <div className="flex flex-col space-y-3">
                    <h3 className="font-semibold text-xl text-stone-800 mb-2 border-b border-rose-300 pb-1 w-max">Kde nás najdete</h3>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        {MAPA_EMBED_KÓD}
                    </div>
                </div>

            </div>

            {/* COPYRIGHT SEKCE POD VŠEMI SLOUPCI */}
            <div className="border-t border-stone-200 py-4">
                <p className="text-center text-sm text-stone-500">
                    © 2026 Bolevecké květiny. Všechna práva vyhrazena.
                </p>
            </div>
        </footer>
    );
}

export default Footer;