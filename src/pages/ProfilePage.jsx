import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../services/cloudinaryService";
import AvatarCropModal from "../components/AvatarCropModal";

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [rawImageUrl, setRawImageUrl] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState(null);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const username  = user?.user_metadata?.username ?? user?.email;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Solo se permiten imágenes"); return; }
    if (file.size > 10 * 1024 * 1024)    { setError("La imagen no puede superar 10 MB"); return; }
    setError(null);
    setSuccess(false);
    setRawImageUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCropConfirm = async (blob) => {
    setRawImageUrl(null);
    setUploading(true);
    try {
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const url  = await uploadImage(file);
      await updateProfile({ avatar_url: url });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    URL.revokeObjectURL(rawImageUrl);
    setRawImageUrl(null);
  };

  return (
    <section className="page profile-page">
      <div className="profile-card">
        <h1>Mi perfil</h1>

        <div className="avatar-wrapper">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder" aria-hidden="true">
              {username?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <button
            type="button"
            className="avatar-edit-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Cambiar avatar"
            title="Cambiar avatar"
          >
            {uploading ? "…" : "✎"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={handleFileChange}
            aria-label="Subir imagen de perfil"
          />
        </div>

        <div className="profile-info">
          <p className="profile-username">{username}</p>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-role">
            Rol: <span className="role-badge">{user?.user_metadata?.role ?? "user"}</span>
          </p>
        </div>

        {success && <p className="profile-success" role="status">¡Avatar actualizado correctamente!</p>}
        {error   && <p className="auth-error" role="alert">{error}</p>}
        <p className="profile-hint">Haz clic en el lápiz para cambiar tu foto de entrenador.</p>
      </div>

      {rawImageUrl && (
        <AvatarCropModal
          imageSrc={rawImageUrl}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </section>
  );
}

export default ProfilePage;
