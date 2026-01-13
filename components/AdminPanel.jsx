import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  writeBatch,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";

// Cloudinary konfigurace
const CLOUD_NAME = "dkpyxmr2k";
const UPLOAD_PRESET = "flower_storage";

const AdminPanel = ({ onLogout }) => {
  // --- STAVY ---
  const [activeTab, setActiveTab] = useState("content");
  const [nazevSekce, setNazevSekce] = useState("");
  const [poradiSekce, setPoradiSekce] = useState("");

  const [kvetina, setKvetina] = useState({
    nazev: "",
    popis: "",
    cena: "",
    skladem: "", // Nové pole pro sklad
    obrazek: null,
    sekce: "",
  });

  const [sekce, setSekce] = useState([]);
  const [kvetiny, setKvetiny] = useState([]);
  const [zprava, setZprava] = useState("");
  const [filterSekce, setFilterSekce] = useState(""); // Filtr pro sekce
  const [sortBy, setSortBy] = useState("newest"); // Řazení: newest, oldest, nameAZ, nameZA
  const [globalSortBy, setGlobalSortBy] = useState("newest"); // Globální řazení pro web

  // Editace
  const [editKvetinaId, setEditKvetinaId] = useState(null);
  const [editKvetinaData, setEditKvetinaData] = useState({
    nazev: "",
    popis: "",
    cena: "",
    skladem: "",
    sekce: "",
    obrazek: null,
    urlObrazku: "",
  });

  const [editSekceId, setEditSekceId] = useState(null);
  const [editSekceData, setEditSekceData] = useState({ nazev: "", poradi: 0 });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // =========================================================================
  // === 1. LOGIKA PRO SEKCE A KVĚTINY ===
  // =========================================================================

  const nactiSekce = async () => {
    try {
      const sectionsQuery = query(
        collection(db, "sections"),
        orderBy("order", "asc"),
        orderBy("name", "asc")
      );
      const querySnapshot = await getDocs(sectionsQuery);
      const sectionsArr = [];
      querySnapshot.forEach((doc) => {
        // Filtrovat konfigurační dokument
        if (doc.id !== "global_settings") {
          sectionsArr.push({ id: doc.id, ...doc.data() });
        }
      });

      setSekce(sectionsArr);
    } catch (err) {
      console.error("Chyba při načítání sekcí: ", err);
    }
  };

  const nactiGlobalniRazeni = async () => {
    try {
      const docRef = doc(db, "sections", "global_settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGlobalSortBy(docSnap.data().sortBy || "newest");
      }
    } catch (err) {
      console.error("Chyba při načítání globálního řazení:", err);
    }
  };

  const ulozGlobalniRazeni = async (novySort) => {
    try {
      setGlobalSortBy(novySort);
      const docRef = doc(db, "sections", "global_settings");
      await setDoc(docRef, { sortBy: novySort, isGlobalConfig: true });
      setZprava("Globální řazení uloženo.");
    } catch (err) {
      console.error("Chyba při ukládání globálního řazení:", err);
      setZprava("Chyba při ukládání řazení.");
    }
  };

  const nactiKvetiny = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "flowers"));
      const flowersArr = [];
      querySnapshot.forEach((doc) =>
        flowersArr.push({ id: doc.id, ...doc.data() })
      );

      const ceskeKvetiny = flowersArr.map((f) => ({
        id: f.id,
        nazev: f.name,
        popis: f.description,
        cena: f.price,
        stock: f.stock !== undefined ? f.stock : 0,
        sekce: f.section,
        urlObrazku: f.imageUrl,
        createdAt: f.createdAt || null,
      }));
      setKvetiny(ceskeKvetiny);
    } catch (err) {
      console.error("Chyba při načítání květin: ", err);
    }
  };

  const pridejSekci = async (e) => {
    e.preventDefault();
    if (!nazevSekce.trim()) return setZprava("Chybí název sekce.");
    const orderVal = Number(poradiSekce) || 0;

    try {
      const docRef = await addDoc(collection(db, "sections"), {
        name: nazevSekce,
        order: orderVal,
      });
      setSekce((prev) => [
        ...prev,
        { id: docRef.id, name: nazevSekce, order: orderVal },
      ]);
      setNazevSekce("");
      setPoradiSekce("");
      setZprava("Sekce přidána.");
    } catch (err) {
      setZprava("Chyba při přidávání sekce.");
    }
  };

  const aktualizujSekci = async (e) => {
    e.preventDefault();
    if (!editSekceId) return;
    const orderVal = Number(editSekceData.poradi);

    try {
      await updateDoc(doc(db, "sections", editSekceId), {
        name: editSekceData.nazev,
        order: orderVal,
      });
      setSekce((prev) =>
        prev.map((s) =>
          s.id === editSekceId
            ? { ...s, name: editSekceData.nazev, order: orderVal }
            : s
        )
      );
      setEditSekceId(null);
      setZprava("Sekce upravena.");
    } catch (err) {
      setZprava("Chyba úpravy.");
    }
  };

  const smazSekci = async (id, nazevSekce) => {
    if (
      !confirm(`Opravdu smazat sekci "${nazevSekce}" a všechny její květiny?`)
    )
      return;
    try {
      const q = query(
        collection(db, "flowers"),
        where("section", "==", nazevSekce)
      );
      const snap = await getDocs(q);
      const batch = writeBatch(db);

      snap.forEach((doc) => batch.delete(doc.ref));
      batch.delete(doc(db, "sections", id));
      await batch.commit();

      setSekce((prev) => prev.filter((s) => s.id !== id));
      setKvetiny((prev) => prev.filter((k) => k.sekce !== nazevSekce));

      setZprava("Sekce a květiny smazány.");
    } catch (err) {
      setZprava("Chyba mazání.");
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const pridejKvetinu = async (e) => {
    e.preventDefault();
    if (!kvetina.obrazek || !kvetina.sekce) return setZprava("Vyplňte vše.");
    setZprava("Nahrávám...");

    try {
      const url = await handleImageUpload(kvetina.obrazek);
      if (!url) return setZprava("Chyba nahrání obrázku.");

      const novaData = {
        name: kvetina.nazev,
        description: kvetina.popis,
        price: Number(kvetina.cena),
        stock: Number(kvetina.skladem) || 0,
        imageUrl: url,
        section: kvetina.sekce,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "flowers"), novaData);

      setKvetiny((prev) => [
        ...prev,
        {
          id: docRef.id,
          nazev: novaData.name,
          popis: novaData.description,
          cena: novaData.price,
          stock: novaData.stock,
          sekce: novaData.section,
          urlObrazku: novaData.imageUrl,
          createdAt: novaData.createdAt,
        },
      ]);

      setKvetina({
        nazev: "",
        popis: "",
        cena: "",
        skladem: "",
        obrazek: null,
        sekce: "",
      });
      document.getElementById("flower-image-input").value = null;
      setZprava("Květina přidána.");
    } catch (err) {
      setZprava("Chyba přidání.");
    }
  };

  const aktualizujKvetinu = async (e) => {
    e.preventDefault();
    setZprava("Ukládám...");
    if (!editKvetinaId) return;

    let url = editKvetinaData.urlObrazku;
    try {
      if (editKvetinaData.obrazek)
        url = await handleImageUpload(editKvetinaData.obrazek);

      const updateData = {
        name: editKvetinaData.nazev,
        description: editKvetinaData.popis,
        price: Number(editKvetinaData.cena),
        stock: Number(editKvetinaData.skladem) || 0,
        section: editKvetinaData.sekce,
        imageUrl: url,
      };

      await updateDoc(doc(db, "flowers", editKvetinaId), updateData);

      setKvetiny((prev) =>
        prev.map((k) =>
          k.id === editKvetinaId
            ? {
              ...k,
              nazev: updateData.name,
              popis: updateData.description,
              cena: updateData.price,
              stock: updateData.stock,
              sekce: updateData.section,
              urlObrazku: updateData.imageUrl,
            }
            : k
        )
      );

      setEditKvetinaId(null);
      setZprava("Upraveno.");
    } catch (err) {
      setZprava("Chyba úpravy.");
    }
  };

  const smazKvetinu = async (id) => {
    if (!confirm("Smazat?")) return;
    try {
      await deleteDoc(doc(db, "flowers", id));
      setKvetiny((prev) => prev.filter((k) => k.id !== id));
      setZprava("Smazáno.");
    } catch (err) {
      setZprava("Chyba mazání.");
    }
  };

  // Pomocné funkce pro editaci
  const zahajUpravuKvetiny = (k) => {
    setEditKvetinaId(k.id);
    setEditKvetinaData({
      nazev: k.nazev,
      popis: k.popis,
      cena: k.cena,
      skladem: k.stock,
      sekce: k.sekce,
      obrazek: null,
      urlObrazku: k.urlObrazku || "",
    });
    window.scrollTo(0, 0);
  };
  const zahajUpravuSekce = (s) => {
    setEditSekceId(s.id);
    setEditSekceData({ nazev: s.name, poradi: s.order });
    window.scrollTo(0, 0);
  };

  // =========================================================================
  // === 2. LOGIKA PRO OBJEDNÁVKY ===
  // =========================================================================

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      ordersList.sort((a, b) => {
        const statusA = a.status || a.fulfillmentStatus;
        const statusB = b.status || b.fulfillmentStatus;
        const isActiveA = statusA === "new" || statusA === "RECEIVED";
        const isActiveB = statusB === "new" || statusB === "RECEIVED";

        if (isActiveA && !isActiveB) return -1;
        if (!isActiveA && isActiveB) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setOrders(ordersList);
    } catch (err) {
      setOrdersError("Nepodařilo se načíst objednávky.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const isNew = currentStatus === "new" || currentStatus === "RECEIVED";
    const newStatus = isNew ? "completed" : "new";

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        fulfillmentStatus: newStatus === "new" ? "RECEIVED" : "FULFILLED",
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
              ...o,
              status: newStatus,
              fulfillmentStatus:
                newStatus === "new" ? "RECEIVED" : "FULFILLED",
            }
            : o
        )
      );
    } catch (err) {
      alert("Chyba při změně stavu.");
    }
  };

  useEffect(() => {
    nactiSekce();
    nactiGlobalniRazeni();
    nactiKvetiny();
    fetchOrders();
  }, []);

  // Helper pro bezpečný výpis ceny
  const formatCurrency = (amount) => {
    if (!amount) return "0 Kč";
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(amount);
  };

  // Nové pomocné funkce pro formátování data a času objednávky
  const formatDate = (timestamp) => {
    let date;
    if (!timestamp) return "—";
    // Snažíme se převést Firebase Timestamp na JavaScript Date objekt
    if (typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else if (typeof timestamp.seconds === "number") {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("cs-CZ");
  };

  const formatTime = (timestamp) => {
    let date;
    if (!timestamp) return "—";
    if (typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else if (typeof timestamp.seconds === "number") {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================================
  // === RENDER ===
  // =========================================================================
  return (
    <div className="max-w-8xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg min-h-screen">
      {/* HLAVIČKA */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-stone-800">
          Administrace Květinářství
        </h2>
        {onLogout && (
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-md mt-4 sm:mt-0"
          >
            Odhlásit se
          </button>
        )}
      </div>

      {/* NAVIGACE */}
      <div className="flex mb-8 gap-4 border-b border-stone-200">
        <button
          onClick={() => setActiveTab("content")}
          className={`pb-3 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === "content"
            ? "border-green-600 text-green-700"
            : "border-transparent text-stone-500"
            }`}
        >
          Produkty
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === "orders"
            ? "border-rose-600 text-rose-700"
            : "border-transparent text-stone-500"
            }`}
        >
          Objednávky
        </button>
      </div>

      {/* ZPRÁVY */}
      {zprava && (
        <div
          className={`mb-4 p-3 rounded border ${zprava.includes("Chyba")
            ? "bg-red-100 text-red-700 border-red-300"
            : "bg-green-100 text-green-700 border-green-300"
            }`}
        >
          {zprava}
        </div>
      )}

      {/* OBSAH: PRODUKTY */}
      {activeTab === "content" && (
        <div className="animate-fade-in">
          {/* Globální nastavení řazení */}
          <div className="mb-8 p-6 border rounded-lg bg-blue-50 border-blue-100">
            <h3 className="text-lg font-semibold mb-2 text-blue-800 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Globální řazení na webu
            </h3>
            <p className="text-sm text-blue-600 mb-4">
              Toto nastavení ovlivní pořadí květin ve všech sekcích na hlavní stránce pro zákazníky.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-1 text-blue-700">Vyberte způsob řazení:</label>
                <select
                  value={globalSortBy}
                  onChange={(e) => ulozGlobalniRazeni(e.target.value)}
                  className="border p-2 rounded w-full bg-white text-blue-900 border-blue-200"
                >
                  <option value="newest">Nejnovější (podle přidání)</option>
                  <option value="oldest">Nejstarší (podle přidání)</option>
                  <option value="nameAZ">Abecedně (A-Z)</option>
                  <option value="nameZA">Abecedně (Z-A)</option>
                  <option value="priceASC">Cena (od nejlevnějšího)</option>
                  <option value="priceDESC">Cena (od nejdražšího)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sekce formuláře */}
          {!editSekceId ? (
            <form
              onSubmit={pridejSekci}
              className="mb-8 p-6 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold mb-2">Přidat sekci</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Název"
                  value={nazevSekce}
                  onChange={(e) => setNazevSekce(e.target.value)}
                  required
                  className="border p-2 flex-grow rounded"
                />
                <input
                  type="number"
                  placeholder="Pořadí"
                  value={poradiSekce}
                  onChange={(e) => setPoradiSekce(e.target.value)}
                  className="border p-2 w-24 rounded"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                >
                  Přidat
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={aktualizujSekci}
              className="mb-8 p-6 border-2 border-green-200 rounded-lg bg-green-50"
            >
              <h3 className="text-lg font-semibold mb-2 text-green-700">
                Upravit sekci
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={editSekceData.nazev}
                  onChange={(e) =>
                    setEditSekceData({
                      ...editSekceData,
                      nazev: e.target.value,
                    })
                  }
                  className="border p-2 flex-grow rounded"
                />
                <input
                  type="number"
                  value={editSekceData.poradi}
                  onChange={(e) =>
                    setEditSekceData({
                      ...editSekceData,
                      poradi: e.target.value,
                    })
                  }
                  className="border p-2 w-24 rounded"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 rounded"
                >
                  Uložit
                </button>
                <button
                  type="button"
                  onClick={() => setEditSekceId(null)}
                  className="bg-gray-400 text-white px-4 rounded"
                >
                  Zrušit
                </button>
              </div>
            </form>
          )}

          {/* Seznam sekcí */}
          <div className="mb-8 flex flex-wrap gap-2">
            {sekce.map((s) => (
              <div
                key={s.id}
                className="bg-stone-200 px-3 py-1 rounded text-sm flex items-center gap-2"
              >
                <b>{s.order}</b> {s.name}
                <button
                  onClick={() => zahajUpravuSekce(s)}
                  className="text-yellow-600 ml-2"
                >
                  ✎
                </button>
                <button
                  onClick={() => smazSekci(s.id, s.name)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <hr className="my-8" />

          {/* Květina formulář */}
          {editKvetinaId ? (
            <form
              onSubmit={aktualizujKvetinu}
              className="mb-8 p-6 border-2 border-blue-200 rounded-lg bg-white"
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Upravit květinu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Název"
                  value={editKvetinaData.nazev}
                  onChange={(e) =>
                    setEditKvetinaData({
                      ...editKvetinaData,
                      nazev: e.target.value,
                    })
                  }
                  required
                  className="border p-2 rounded"
                />

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Cena"
                    value={editKvetinaData.cena}
                    onChange={(e) =>
                      setEditKvetinaData({
                        ...editKvetinaData,
                        cena: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Skladem (ks)"
                    value={editKvetinaData.skladem}
                    onChange={(e) =>
                      setEditKvetinaData({
                        ...editKvetinaData,
                        skladem: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-1/2"
                  />
                </div>

                <select
                  value={editKvetinaData.sekce}
                  onChange={(e) =>
                    setEditKvetinaData({
                      ...editKvetinaData,
                      sekce: e.target.value,
                    })
                  }
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Vyberte sekci</option>
                  {sekce.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  onChange={(e) =>
                    setEditKvetinaData({
                      ...editKvetinaData,
                      obrazek: e.target.files[0],
                    })
                  }
                  className="border p-2 rounded"
                />
                <textarea
                  placeholder="Popis"
                  value={editKvetinaData.popis}
                  onChange={(e) =>
                    setEditKvetinaData({
                      ...editKvetinaData,
                      popis: e.target.value,
                    })
                  }
                  required
                  className="border p-2 rounded col-span-1 sm:col-span-2"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Uložit změny
                </button>
                <button
                  type="button"
                  onClick={() => setEditKvetinaId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Zrušit
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={pridejKvetinu}
              className="mb-8 p-6 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold mb-2">Přidat květinu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Název"
                  value={kvetina.nazev}
                  onChange={(e) =>
                    setKvetina({ ...kvetina, nazev: e.target.value })
                  }
                  required
                  className="border p-2 rounded"
                />

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Cena"
                    value={kvetina.cena}
                    onChange={(e) =>
                      setKvetina({ ...kvetina, cena: e.target.value })
                    }
                    required
                    className="border p-2 rounded w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Skladem (ks)"
                    value={kvetina.skladem}
                    onChange={(e) =>
                      setKvetina({ ...kvetina, skladem: e.target.value })
                    }
                    required
                    className="border p-2 rounded w-1/2"
                  />
                </div>

                <select
                  value={kvetina.sekce}
                  onChange={(e) =>
                    setKvetina({ ...kvetina, sekce: e.target.value })
                  }
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Vyberte sekci</option>
                  {sekce.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  id="flower-image-input"
                  onChange={(e) =>
                    setKvetina({ ...kvetina, obrazek: e.target.files[0] })
                  }
                  required
                  className="border p-2 rounded"
                />
                <textarea
                  placeholder="Popis"
                  value={kvetina.popis}
                  onChange={(e) =>
                    setKvetina({ ...kvetina, popis: e.target.value })
                  }
                  required
                  className="border p-2 rounded col-span-1 sm:col-span-2"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Přidat květinu
              </button>
            </form>
          )}

          {/* Seznam květin */}
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-stone-700">
                Filtrovat podle sekce:
              </label>
              <select
                value={filterSekce}
                onChange={(e) => setFilterSekce(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Všechny sekce</option>
                {sekce.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-stone-700">
                Řadit podle:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="newest">Nejnovější</option>
                <option value="oldest">Nejstarší</option>
                <option value="nameAZ">Název A-Z</option>
                <option value="nameZA">Název Z-A</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kvetiny
              .filter((k) => !filterSekce || k.sekce === filterSekce)
              .sort((a, b) => {
                switch (sortBy) {
                  case "newest":
                    if (!a.createdAt) return 1;
                    if (!b.createdAt) return -1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  case "oldest":
                    if (!a.createdAt) return 1;
                    if (!b.createdAt) return -1;
                    return new Date(a.createdAt) - new Date(b.createdAt);
                  case "nameAZ":
                    return a.nazev.localeCompare(b.nazev, "cs");
                  case "nameZA":
                    return b.nazev.localeCompare(a.nazev, "cs");
                  default:
                    return 0;
                }
              })
              .map((k) => (
                <div
                  key={k.id}
                  className="border p-4 rounded shadow bg-white flex flex-col relative"
                >
                  <div className="h-40 w-full relative mb-4">
                    {k.urlObrazku ? (
                      <Image
                        src={k.urlObrazku}
                        fill
                        className="object-cover rounded"
                        alt={k.nazev}
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full" />
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow text-stone-700">
                      Sklad: {k.stock} ks
                    </div>
                  </div>
                  <h3 className="font-bold text-lg">{k.nazev}</h3>
                  <p className="text-gray-500 text-sm">
                    {k.sekce} - {k.cena} Kč
                  </p>
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      onClick={() => zahajUpravuKvetiny(k)}
                      className="bg-blue-600 text-white px-3 py-1 rounded flex-1"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => smazKvetinu(k.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded flex-1"
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Seznam objednávek</h3>
            <button
              onClick={fetchOrders}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Obnovit
            </button>
          </div>

          {loadingOrders && <p>Načítání...</p>}
          {ordersError && <p className="text-red-500">{ordersError}</p>}

          {!loadingOrders && !ordersError && (
            <div className="overflow-x-auto bg-white shadow rounded border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Zákazník
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Položky
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Vzkaz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Cena
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                      Stav
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => {
                    const status = order.status || order.fulfillmentStatus;
                    const isNew = status === "new" || status === "RECEIVED";

                    return (
                      <tr
                        key={order.id}
                        className={isNew ? "bg-rose-50" : "bg-white"}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {order.customerName || "Neznámý"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customerEmail}
                          </div>

                          {/* PŘIDANÝ ČAS A DATUM OBJEDNÁVKY */}
                          <div className="text-xs text-stone-500 mt-1 font-semibold">
                            Objednáno: {formatDate(order.createdAt)} v{" "}
                            {formatTime(order.createdAt)}
                          </div>
                          {/* Konec přidaného */}

                          <div className="text-xs text-stone-500 mt-1">
                            Č. obj:{" "}
                            <span className="font-bold text-stone-700">
                              #{order.id.slice(-5).toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          {Array.isArray(order.items)
                            ? order.items.map((item, i) => (
                              <div key={i}>
                                {item.name}{" "}
                                <span className="text-gray-400">
                                  ({item.quantity}x)
                                </span>
                              </div>
                            ))
                            : order.items
                              ? order.items
                                .split(",")
                                .map((part, i) => (
                                  <div key={i}>{part.trim()}</div>
                                ))
                              : "Žádné položky"}
                        </td>
                        {/* NOVÝ SLOUPEC: Vzkaz */}
                        <td className="px-6 py-4 text-xs text-stone-600 max-w-[150px] whitespace-pre-wrap">
                          <p className="font-medium">
                            {order.customerNote || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">
                          {formatCurrency(order.amount || order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-bold ${isNew
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                              }`}
                          >
                            {isNew ? "NOVÁ" : "HOTOVO"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleUpdateStatus(order.id, status)}
                            className={`text-white text-xs px-3 py-1 rounded ${isNew
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-orange-500 hover:bg-orange-600"
                              }`}
                          >
                            {isNew ? "Dokončit" : "Vrátit zpět"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="p-4 text-center text-gray-500">
                  Žádné objednávky.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
