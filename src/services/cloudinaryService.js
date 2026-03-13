const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn("Faltan variables de entorno de Cloudinary");
}

/**
 * Sube un archivo de imagen a Cloudinary usando un preset sin firmar.
 * @param {File} file
 * @returns {Promise<string>} URL segura de la imagen subida
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Error al subir la imagen");
  }

  const data = await res.json();
  return data.secure_url;
}
