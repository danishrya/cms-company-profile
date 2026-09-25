import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { 
  FileText, 
  Sparkles, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  PlusCircle,
  Layers,
  BookOpen
} from "lucide-react";

const DEFAULT_ARTICLE_HERO_DATA = {
  badge: "Portal Edukasi & Berita Resmi",
  title: "Edukasi Finansial & Kasbon Modern",
  highlight: "Akses Gaji Fleksibel Bebas Bunga",
  subtitle: "Pelajari strategi pengelolaan keuangan karyawan, regulasi resmi EWA (Earned Wage Access) Bank Indonesia, serta panduan praktis integrasi sistem kasbon digital untuk perusahaan Anda."
};

export default function ArticleHeroManager() {
  const [formData, setFormData] = useState(DEFAULT_ARTICLE_HERO_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    async function loadHeroData() {
      try {
        setLoading(true);
        let snap = await getDoc(doc(db, "articles", "__page_articles_hero"));
        if (!snap.exists()) {
          try {
            snap = await getDoc(doc(db, "site_content", "articles_hero"));
          } catch {}
        }

        if (snap.exists()) {
          const remoteData = snap.data();
          setFormData({
            ...DEFAULT_ARTICLE_HERO_DATA,
            ...remoteData
          });
        }
      } catch (err) {
        console.error("Gagal memuat hero artikel:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHeroData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4500);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        lastUpdated: serverTimestamp()
      };

      await setDoc(doc(db, "articles", "__page_articles_hero"), payload, { merge: true });
      try {
        await setDoc(doc(db, "site_content", "articles_hero"), payload, { merge: true });
      } catch {}

      showToast("Header & Hero Artikel berhasil disimpan ke Firebase!");
    } catch (err) {
      console.error("Gagal menyimpan hero artikel:", err);
      alert("Gagal menyimpan data: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = () => {
    if (window.confirm("Kembalikan teks Header & Hero Artikel ke pengaturan default resmi?")) {
      setFormData(DEFAULT_ARTICLE_HERO_DATA);
      showToast("Formulir telah direset ke nilai default.");
    }
  };

  if (loading) {
    return (
      <div className="cms-page-container">
        <div className="cms-loading-state">
          <div className="cms-spinner" />
          <p>Memuat Pengaturan Hero Artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-page-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`cms-toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          <div className="d-flex align-center gap-2">
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Pengelola Header & Hero Artikel</h1>
          <p className="cms-page-subtitle">
            Kustomisasi teks banner utama, highlight judul, dan subjudul edukasi yang tampil di bagian paling atas katalog berita (/berita-artikel).
          </p>
        </div>

        <div className="cms-header-actions">
          <a
            href="http://localhost:5175/berita-artikel"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
          >
            <ExternalLink size={16} />
            <span>Lihat Halaman Live</span>
          </a>

          <Link to="/articles" className="btn-secondary-action">
            <BookOpen size={16} />
            <span>Kelola Artikel</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary-action"
          >
            {saving ? <div className="cms-spinner-sm" /> : <Save size={16} />}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Navigasi Tab Cepat */}
      <div className="cms-tabs-bar">
        <Link to="/articles/hero" className="cms-tab-btn active">
          <Sparkles size={16} />
          <span>1. Header & Hero Edukasi</span>
        </Link>
        <Link to="/articles" className="cms-tab-btn">
          <FileText size={16} />
          <span>2. Daftar Semua Artikel</span>
        </Link>
        <Link to="/articles/new" className="cms-tab-btn">
          <PlusCircle size={16} />
          <span>3. Tulis Artikel Baru</span>
        </Link>
      </div>

      {/* Editor Formulir */}
      <div className="cms-editor-card mb-4">
        <div className="editor-card-header">
          <div>
            <h3>Konfigurasi Teks Banner Hero Artikel</h3>
            <p>Teks ini tampil dengan latar belakang biru khas Ayo Kasbon beserta efek cahaya dan dekorasi bintang berkilau.</p>
          </div>
          <span className="badge-live-tag">Terkoneksi ke /berita-artikel</span>
        </div>

        <div className="form-grid-layout">
          <div className="form-half-col">
            <label className="form-label-bold">1. Label / Badge Tagline</label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
              placeholder="Portal Edukasi & Berita Resmi"
              className="form-input"
            />
            <span className="form-hint-text">Badge kecil di bagian atas judul.</span>
          </div>

          <div className="form-half-col">
            <label className="form-label-bold">2. Baris Judul Utama</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Edukasi Finansial & Kasbon Modern"
              className="form-input"
            />
          </div>

          <div className="form-full-col">
            <label className="form-label-bold">3. Highlight Teks Berwarna (Baris Kedua Judul)</label>
            <input
              type="text"
              value={formData.highlight}
              onChange={(e) => setFormData((prev) => ({ ...prev, highlight: e.target.value }))}
              placeholder="Akses Gaji Fleksibel Bebas Bunga"
              className="form-input"
            />
            <span className="form-hint-text">Ditampilkan dengan efek warna cerah yang menonjol di banner.</span>
          </div>

          <div className="form-full-col">
            <label className="form-label-bold">4. Subjudul / Deskripsi Edukasi</label>
            <textarea
              rows={4}
              value={formData.subtitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Pelajari strategi pengelolaan keuangan karyawan..."
              className="form-textarea"
            />
          </div>
        </div>
      </div>

      {/* Pratinjau Langsung (Live Preview) */}
      <div className="cms-editor-card">
        <div className="editor-card-header">
          <div className="d-flex align-center gap-2">
            <Eye size={18} className="text-blue" />
            <h3 style={{ margin: 0 }}>Pratinjau Tampilan Hero Banner</h3>
          </div>
          <span className="text-xs text-muted">Simulasi Visual Asli Website</span>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
          borderRadius: "12px",
          padding: "40px 24px",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(30, 58, 138, 0.3)"
        }}>
          {formData.badge && (
            <div style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              padding: "4px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              marginBottom: "16px",
              color: "#93c5fd"
            }}>
              {formData.badge}
            </div>
          )}

          <h2 style={{
            fontSize: "28px",
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: "12px",
            color: "#ffffff"
          }}>
            {formData.title} <br />
            <span style={{ color: "#38bdf8" }}>{formData.highlight}</span>
          </h2>

          <p style={{
            maxWidth: "680px",
            margin: "0 auto",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#cbd5e1"
          }}>
            {formData.subtitle}
          </p>
        </div>
      </div>

      {/* Floating Bottom Bar for Quick Save */}
      <div className="cms-bottom-save-bar">
        <div className="save-bar-info">
          <span>Pastikan untuk menyimpan perubahan setelah mengedit formulir Hero Artikel.</span>
        </div>
        <div className="d-flex align-center gap-2">
          <button 
            type="button" 
            onClick={handleResetDefault}
            className="btn-secondary-action"
          >
            <RotateCcw size={15} />
            <span>Reset Bawaan</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary-action"
          >
            {saving ? <div className="cms-spinner-sm" /> : <Save size={16} />}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan ke Firebase"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
