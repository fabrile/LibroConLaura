document.addEventListener("DOMContentLoaded", () => {
  const fraseElement = document.getElementById("frase");
  const btn = document.getElementById("generate-btn");
  let frasesData = null;

  // URL del Web App de Google Apps Script (reemplazar después de desplegar)
  const GSHEETS_URL = "https://script.google.com/macros/s/AKfycbzMZojwRqUeNNwLfFOhLrqUoQwQoY9li-DM9JSsDiEKnbQ7JjSDzSpVKF_f4kXc8OuIZQ/exec";

  // Cargar el JSON
  fetch("frases.json")
    .then((response) => response.json())
    .then((data) => {
      frasesData = data.frases;
    })
    .catch((error) => {
      console.error("Error cargando las frases:", error);
      fraseElement.innerText = "Error al cargar las frases.";
    });

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generar un hash corto para identificar partes de la frase
  function getHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36).substring(0, 6);
  }

  async function saveToGSheets(data) {
    if (GSHEETS_URL.includes("TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI") || GSHEETS_URL === "") {
      console.warn("GSHEETS_URL no configurada. Saltando guardado centralizado.");
      return;
    }
    
    console.log("Enviando insulto a Google Sheets...", data);
    
    try {
      await fetch(GSHEETS_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data)
      });
      console.log("Datos enviados correctamente a la Web App.");
    } catch (e) {
      console.error("Error al enviar a Google Sheets:", e);
    }
  }

  function generarInsulto() {
    if (!frasesData) return;

    const p1 = getRandomElement(frasesData.primeraParte);
    const p2 = getRandomElement(frasesData.segundaParte);
    const p3 = getRandomElement(frasesData.terceraParte);

    // Generar hashes
    const h1 = getHash(p1);
    const h2 = getHash(p2);
    const h3 = getHash(p3);
    const insultHash = `${h1}-${h2}-${h3}`;

    // Limpiar espacios extra y combinar
    const textoCompleto = `${p1.trim()} ${p2.trim()} ${p3.trim()}.`;

    // Actualizar el DOM
    fraseElement.innerHTML = `${textoCompleto} <span class="middle-finger">🖕</span>`;

    // Guardar en Google Sheets centralizado
    saveToGSheets({
      p1: p1.trim(),
      p2: p2.trim(),
      p3: p3.trim(),
      h1: h1,
      h2: h2,
      h3: h3,
      fullHash: insultHash,
      text: textoCompleto,
      timestamp: new Date().toISOString()
    });
  }

  btn.addEventListener("click", generarInsulto);
});
