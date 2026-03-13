import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedBlob } from "../utils/cropImage";

/**
 * Modal de recorte circular para el avatar.
 * @param {string}   imageSrc   URL del objeto (createObjectURL)
 * @param {Function} onConfirm  Recibe el Blob recortado
 * @param {Function} onCancel
 */
function AvatarCropModal({ imageSrc, onConfirm, onCancel }) {
  const [crop, setCrop]           = useState({ x: 0, y: 0 });
  const [zoom, setZoom]           = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [processing, setProcessing]   = useState(false);

  const onCropComplete = useCallback((_percentArea, pixelArea) => {
    setCroppedArea(pixelArea);
  }, []);

  const handleConfirm = async () => {
    if (!croppedArea) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      onConfirm(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Recortar avatar">
      <div className="modal-box">
        <h2 className="modal-title">Ajusta tu avatar</h2>

        <div className="crop-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="crop-zoom">
          <label htmlFor="zoom-slider">Zoom</label>
          <input
            id="zoom-slider"
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="zoom-slider"
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onCancel} disabled={processing}>
            Cancelar
          </button>
          <button type="button" className="btn" onClick={handleConfirm} disabled={processing}>
            {processing ? "Procesando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarCropModal;
