"use client";
import React from "react";
import { motion } from "framer-motion";

const FlowerGuide = () => {
    const colors = [
        { color: "Červená", meaning: "Vášeň, hluboká láska, energie.", for: "Partnerka/partner, vyznání lásky.", bgColor: "bg-red-100", textColor: "text-red-800", borderColor: "border-red-300" },
        { color: "Růžová", meaning: "Jemnost, vděčnost, romantika, přátelství.", for: "Maminka, kamarádka, začátek vztahu.", bgColor: "bg-pink-100", textColor: "text-pink-800", borderColor: "border-pink-300" },
        { color: "Bílá", meaning: "Čistota, nevinnost, úcta, upřímnost.", for: "Nevěsty, omluva, vyjádření respektu.", bgColor: "bg-gray-50", textColor: "text-gray-800", borderColor: "border-gray-300" },
        { color: "Žlutá", meaning: "Radost, energie, přátelství (pozor: dříve žárlivost).", for: "Přátelé, kolegové, pro rozveselení.", bgColor: "bg-yellow-100", textColor: "text-yellow-800", borderColor: "border-yellow-300" },
        { color: "Oranžová", meaning: "Nadšení, teplo, optimismus.", for: "Oslavy úspěchu, rodinné návštěvy.", bgColor: "bg-orange-100", textColor: "text-orange-800", borderColor: "border-orange-300" },
        { color: "Modrá/Fialová", meaning: "Klid, věrnost, tajemno, duchovno.", for: "Kreativní lidé, dlouholetí přátelé.", bgColor: "bg-purple-100", textColor: "text-purple-800", borderColor: "border-purple-300" },
    ];

    const careTypes = [
        {
            title: "\"Vrah rostlin\" (Zapomnětlivý typ)",
            description: "Tato osoba miluje krásu, ale zapomíná zalévat.",
            suitable: "Sukulenty, tchynin jazyk (Sansevieria), zamiokulkas nebo sušené kytice, které vypadají skvěle i bez kapky vody.",
            icon: "🌵"
        },
        {
            title: "Zaneprázdněný profesionál",
            description: "Má rád styl, ale nemá čas na složitou údržbu.",
            suitable: "Orchideje (stačí jednou týdně namočit), anturie nebo řezané lilie (dlouho vydrží ve váze).",
            icon: "💼"
        },
        {
            title: "Nadšený pěstitel",
            description: "Miluje výzvy a péči o detaily.",
            suitable: "Azalky, gardenie, náročnější druhy kapradin nebo sezónní venkovní rostliny na balkon.",
            icon: "🌿"
        },
        {
            title: "Tradicionalista",
            description: "Sází na klasiku a ověřené hodnoty.",
            suitable: "Velká kytice růží, tulipány nebo v květináči klasické bramboříky a begonie.",
            icon: "🌹"
        }
    ];

    const occasions = [
        {
            title: "První rande",
            advice: "Volte něco lehčího a méně závazného. Jedna krásná růže, trs gerber nebo sezónní luční kvítí. Vyhněte se obřím pugétům, které se špatně nosí.",
            icon: "💕"
        },
        {
            title: "Narozeniny a jubilea",
            advice: "Kytice by měla být pestrá a odrážet osobnost oslavence. Čím kulatější výročí, tím bohatší vazba.",
            icon: "🎂"
        },
        {
            title: "Omluva",
            advice: "Ideální je bílá (symbolizuje čistý štít) nebo oblíbená květina dané osoby. Kytice by měla působit pokorně, ne okázale.",
            icon: "🙏"
        },
        {
            title: "Návštěva v nemocnici",
            advice: "Vyhněte se květinám se silnou vůní (lilie, hyacinty) a těm, které pouští hodně pylu. Ideální jsou veselé gerbery nebo chryzantémy.",
            icon: "🏥"
        },
        {
            title: "Smutek a kondolence",
            advice: "Volí se tlumené barvy (bílá, fialová, tmavě červená). V Česku je zvykem u smutečních vazeb sudý počet květů.",
            icon: "🕊️"
        }
    ];

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-stone-900 mb-6">
                        Jak vybrat květiny
                    </h1>
                    <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
                        Výběr správné květiny není jen o kráse – je to umění vyjádřit city, respektovat příležitost a potěšit obdarovaného.
                    </p>
                </motion.div>

                {/* Teorie barev */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-serif font-medium text-green-800 mb-4 text-center">
                        🎨 Teorie barev: Co říkáte barvou květiny?
                    </h2>
                    <p className="text-center text-stone-600 mb-8">
                        Barvy mají svou vlastní symboliku a dokážou ovlivnit náladu obdarovaného.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {colors.map((item, index) => (
                            <motion.div
                                key={index}
                                className={`${item.bgColor} ${item.borderColor} border-2 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className={`text-xl font-bold ${item.textColor} mb-3`}>
                                    {item.color}
                                </h3>
                                <p className="text-stone-700 mb-3 text-sm">
                                    <strong>Význam:</strong> {item.meaning}
                                </p>
                                <p className="text-stone-700 text-sm">
                                    <strong>Pro koho:</strong> {item.for}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Výběr podle péče */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-serif font-medium text-green-800 mb-4 text-center">
                        🌱 Výběr podle péče: Kdo kytici dostane?
                    </h2>
                    <p className="text-center text-stone-600 mb-8">
                        Při výběru květiny v květináči (nebo i řezané) je dobré zvážit, jaký vztah má dotyčný k pěstování.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {careTypes.map((type, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600 hover:shadow-lg transition-shadow"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl">{type.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-stone-900 mb-2">
                                            {type.title}
                                        </h3>
                                        <p className="text-stone-600 mb-3 text-sm italic">
                                            {type.description}
                                        </p>
                                        <p className="text-stone-700 text-sm">
                                            <strong className="text-green-700">Vhodné:</strong> {type.suitable}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Květiny pro konkrétní příležitosti */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-serif font-medium text-green-800 mb-8 text-center">
                        🎁 Květiny pro konkrétní příležitosti
                    </h2>

                    <div className="space-y-4">
                        {occasions.map((occasion, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-r from-green-50 to-white rounded-lg shadow-sm p-6 border border-green-100 hover:shadow-md transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{occasion.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-stone-900 mb-2">
                                            {occasion.title}
                                        </h3>
                                        <p className="text-stone-700">
                                            {occasion.advice}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Etiketa a praktické tipy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-serif font-medium text-green-800 mb-8 text-center">
                        ✨ Etiketa a praktické tipy
                    </h2>

                    <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                                        📊 Sudý vs. lichý počet
                                    </h3>
                                    <p className="text-stone-700 text-sm">
                                        V české tradici platí, že lichý počet dáváme pro radost, sudý na pohřeb. Dnes se od toho u velkých kytic (např. 50 růží) upouští, ale u menších počtů je dobré to dodržet.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                                        🎁 Odstranění obalu
                                    </h3>
                                    <p className="text-stone-700 text-sm">
                                        Pokud předáváte kytici osobně, měli byste ji vybalit z papíru (pokud papír není dekorativní součástí vazby). Kytici držte v levé ruce, aby pravá zůstala volná na podání ruky.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                                        🌸 Čerstvost
                                    </h3>
                                    <p className="text-stone-700 text-sm">
                                        Při nákupu zkontrolujte stonky (nesmí být slizké) a poupata (měla by být pevná, ne úplně uzavřená, ale ani přezrálá).
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                                        👃 Vůně
                                    </h3>
                                    <p className="text-stone-700 text-sm">
                                        Pozor na silně vonící květiny v malých bytech nebo u lidí s alergiemi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-stone-200">
                            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                                <p className="text-stone-800">
                                    <strong className="text-green-800">💡 Tip:</strong> Pokud si nejste jisti barvou, zvolte krémovou nebo lososovou. Jsou to bezpečné, elegantní barvy, které nikoho neurazí a hodí se pro každou příležitost.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default FlowerGuide;
