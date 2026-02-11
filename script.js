document.addEventListener("DOMContentLoaded", () => {
  const fraseElement = document.getElementById("frase");
  const btn = document.getElementById("generate-btn");
  let frasesData = null;

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

  function generarInsulto() {
    if (!frasesData) return;

    const p1 = getRandomElement(frasesData.primeraParte);
    const p2 = getRandomElement(frasesData.segundaParte);
    const p3 = getRandomElement(frasesData.terceraParte);

    // Limpiar espacios extra y combinar
    const textoCompleto = `${p1.trim()} ${p2.trim()} ${p3.trim()}.`;

    // Actualizar el DOM
    fraseElement.innerHTML = `${textoCompleto} <span class="middle-finger">🖕</span>`;
  }

  btn.addEventListener("click", generarInsulto);
});
