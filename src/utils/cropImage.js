/**
 * Genera un Blob recortado a partir de una imagen y el área de crop.
 * @param {string} imageSrc  URL del objeto (createObjectURL)
 * @param {object} croppedArea  { x, y, width, height } en píxeles
 * @param {string} [mimeType]
 * @returns {Promise<Blob>}
 */
export async function getCroppedBlob(imageSrc, croppedArea, mimeType = "image/jpeg") {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width  = croppedArea.width;
  canvas.height = croppedArea.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    croppedArea.x,
    croppedArea.y,
    croppedArea.width,
    croppedArea.height,
    0,
    0,
    croppedArea.width,
    croppedArea.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar el recorte"));
    }, mimeType, 0.92);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = src;
  });
}
