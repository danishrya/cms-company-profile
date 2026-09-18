import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Email atau password yang Anda masukkan salah.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan login gagal. Silakan tunggu beberapa saat.");
      } else {
        setError("Gagal login: " + (err.message || "Periksa koneksi Anda."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-glow-circle-1" aria-hidden="true"></div>
      <div className="login-glow-circle-2" aria-hidden="true"></div>

      <div className="login-card-container">
        {/* Card Header */}
        <div className="login-card-header">
          <img src={logo} alt="Ayo Kasbon" className="login-brand-logo" />
          <div className="login-brand-tag">PORTAL CMS ADMIN</div>
          <h1 className="login-title">Masuk ke Dashboard</h1>
          <p className="login-subtitle">
            Kelola publikasi berita, artikel finansial, dan edukasi aplikasi EWA Ayo Kasbon.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Admin
            </label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email-input"
                type="email"
                required
                placeholder="admin@ayokasbon.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan password akun admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                className="btn-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Tampilkan password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-login-submit"
          >
            {submitting ? (
              <span>Memverifikasi Akun...</span>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-card-footer">
          <ShieldCheck size={16} className="text-emerald" />
          <span>Autentikasi Terenkripsi Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
