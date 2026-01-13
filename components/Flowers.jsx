"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
// PŘIDÁNO: query a orderBy pro řazení
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import Image from "next/image";
import { useCart } from "../context/CartContext";

const staticCollections = [];

const Flowers = () => {
  const [collections, setCollections] = useState(staticCollections);
  const { addToCart } = useCart();

  useEffect(() => {
    const sectionsQuery = query(
      collection(db, "sections"),
      orderBy("order", "asc")
    );

    const unsubSections = onSnapshot(sectionsQuery, (sectionsSnap) => {
      const sectionsArr = [];
      sectionsSnap.forEach((doc) => {
        if (doc.id !== "global_settings") {
          sectionsArr.push({ id: doc.id, ...doc.data() });
        }
      });

      onSnapshot(doc(db, "sections", "global_settings"), (settingsSnap) => {
        const globalSort = settingsSnap.exists() ? settingsSnap.data().sortBy : "newest";

        onSnapshot(collection(db, "flowers"), (flowersSnap) => {
          const flowersArr = [];
          flowersSnap.forEach((doc) => {
            const data = doc.data();
            flowersArr.push({
              id: doc.id,
              ...data,
              stock: data.stock !== undefined ? data.stock : 0
            });
          });

          // Funkce pro řazení
          const sortItems = (items) => {
            return [...items].sort((a, b) => {
              switch (globalSort) {
                case "newest":
                  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case "oldest":
                  return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                case "nameAZ":
                  return (a.name || "").localeCompare(b.name || "", "cs");
                case "nameZA":
                  return (b.name || "").localeCompare(a.name || "", "cs");
                case "priceASC":
                  return Number(a.price || 0) - Number(b.price || 0);
                case "priceDESC":
                  return Number(b.price || 0) - Number(a.price || 0);
                default:
                  return 0;
              }
            });
          };

          // Seskupení a seřazení položek v rámci každé sekce
          const dynamicCollections = sectionsArr.map((section) => ({
            title: section.name,
            items: sortItems(flowersArr.filter((flower) => flower.section === section.name))
          }));

          setCollections(dynamicCollections.length > 0 ? dynamicCollections : staticCollections);
        });
      });
    });
    return () => unsubSections();
  }, []);

  return (
    <section id="flowers" className="py-16 px-4 md:px-8 lg:px-20 bg-white">
      {collections.map((collection, sectionIndex) => (
        // Zobrazíme sekci jen pokud v ní něco je (volitelné)
        collection.items.length > 0 && (
          <div key={sectionIndex} className="mb-24 last:mb-0">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center text-stone-800 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {collection.title}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {collection.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col h-full text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="relative mb-6 overflow-hidden">
                    <Image
                      src={item.img || item.imageUrl}
                      alt={`${item.name} - Čerstvé květiny z Boleveckého květinářství`}
                      width={400}
                      height={400}
                      className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {item.stock > 0 && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-white text-stone-900 px-6 py-2 rounded-full font-medium hover:bg-stone-100 transform translate-y-4 group-hover:translate-y-0 transition-all"
                        >
                          Přidat do košíku
                        </button>
                      </div>
                    )}

                    {item.stock < 3 && item.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                        Poslední kusy!
                      </div>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="bg-stone-800 text-white px-4 py-2 font-bold uppercase tracking-widest text-sm">Vyprodáno</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col grow px-2">
                    <h3 className="text-lg font-medium text-stone-900 mb-2 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-stone-800 font-semibold mb-1 text-lg">
                      {item.price} Kč
                    </p>

                    <p className={`text-xs mb-3 font-medium ${item.stock < 3 ? "text-red-600" : "text-green-600"}`}>
                      {item.stock > 0
                        ? `Skladem: ${item.stock} ks`
                        : "Není skladem"}
                    </p>

                    <p className="text-stone-500 text-sm mb-4">
                      {item.subtitle}
                    </p>

                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className={`mt-auto border px-4 py-2 rounded transition-colors text-sm uppercase tracking-wider ${item.stock === 0
                        ? "border-stone-200 text-stone-300 cursor-not-allowed"
                        : "border-stone-300 text-stone-600 hover:bg-stone-900 hover:text-white"
                        }`}
                    >
                      {item.stock === 0 ? "Vyprodáno" : "Do košíku"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      ))}
    </section>
  );
};

export default Flowers;