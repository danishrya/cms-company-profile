import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { 
  Building2, 
  Image as ImageIcon, 
  Layers, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Sparkles,
  Save,
  RotateCcw,
  Upload,
  Link2,
  Trash2,
  DollarSign,
  ShieldCheck,
  Zap,
  Check,
  HeartHandshake,
  AlertCircle
} from "lucide-react";

// Default content bawaan resmi Ayo Kasbon
const DEFAULT_ABOUT_DATA = {
  hero: {
    title: "Tentang Kami",
    description: "Pelajari dedikasi dan komitmen AYO Kasbon dalam menghadirkan Platform Kasbon Instan terdepan di Indonesia untuk meningkatkan kesejahteraan finansial karyawan serta efisiensi bisnis Anda.",
    highlightWord: "Platform Kasbon Instan",
    primaryBtnText: "Mulai Sekarang",
    primaryBtnLink: "https://app.ayokasbon.com/",
    secondaryBtnText: "Pelajari Sejarah Kami",
    secondaryBtnLink: "#sejarah-perusahaan"
  },
  history: {
    photo: "", // Kosong = gunakan aset lokal team-history.png
    badge: "Didirikan Agustus 2023",
    eyebrow: "Perjalanan & Komitmen Kami",
    title: "Sejarah Perusahaan",
    founder1: "Ari Gunawan",
    founder2: "Tona Mahfirohman",
    paragraph: "Didirikan pada Agustus 2023 oleh Ari Gunawan dan Tona Mahfirohman, AYO Kasbon didukung oleh tim berpengalaman di teknologi dan keuangan. Dengan visi bersama, kami berkomitmen untuk menjadikan AYO Kasbon solusi finansial terdepan yang meningkatkan produktivitas karyawan dan efisiensi bisnis melalui kasbon digital yang cepat, adil, transparan, dan aman."
  },
  why: {
    title: "Kenapa Harus Ayo Kasbon?",
    mockupImage: "", // Kosong = gunakan aset lokal why-mockup-phone.png
    features: [
      {
        id: 1,
        title: "Tanpa Bunga",
        desc: "Ayo Kasbon bukan merupakan Pinjaman, karyawan hanya dikenakan Biaya Admin",
        iconType: "dollar"
      },
      {
        id: 2,
        title: "Tanpa Riba",
        desc: "Ayo Kasbon beroperasi sesuai dengan Prinsip Syariah dan Regulasi yang Berlaku",
        iconType: "shield"
      },
      {
        id: 3,
        title: "Pencairan Cepat",
        desc: "Dana kasbon langsung cair ke rekening dalam hitungan menit secara instan",
        iconType: "zap"
      }
    ]
  },
  consultation: {
    title: "Konsultasi Gratis dan Demo Aplikasi",
    subtitle: "Daftar Segera untuk Konsultasi",
    buttonText: "Hubungi Kami",
    buttonLink: "/hubungi-kami",
    bannerImage: ""
  }
};

export default function AboutManager() {
  const { section = "hero" } = useParams();

  const [formData, setFormData] = useState(DEFAULT_ABOUT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // State upload file
  const [uploadingHistoryPhoto, setUploadingHistoryPhoto] = useState(false);
  const [uploadingMockupPhoto, setUploadingMockupPhoto] = useState(false);

  const tabs = [
    { id: "hero", label: "1. Hero Profil & Visi", icon: Sparkles },
    { id: "history", label: "2. Sejarah & Foto Tim", icon: ImageIcon },
    { id: "why", label: "3. Kenapa Ayo Kasbon", icon: Layers },
    { id: "consultation", label: "4. Banner Konsultasi CS", icon: PhoneCall },
  ];

  // Muat data dari Firestore
  useEffect(() => {
    async function loadAboutData() {
      try {
        setLoading(true);
        let snap = await getDoc(doc(db, "articles", "__page_about"));
        if (!snap.exists()) {
          try {
            snap = await getDoc(doc(db, "site_content", "about"));
          } catch {}
        }

        if (snap.exists()) {
          const remoteData = snap.data();
          setFormData({
            hero: { ...DEFAULT_ABOUT_DATA.hero, ...remoteData.hero },
            history: { ...DEFAULT_ABOUT_DATA.history, ...remoteData.history },
            why: { 
              ...DEFAULT_ABOUT_DATA.why, 
              ...remoteData.why,
              features: remoteData.why?.features?.length ? remoteData.why.features : DEFAULT_ABOUT_DATA.why.features
            },
            consultation: { ...DEFAULT_ABOUT_DATA.consultation, ...remoteData.consultation }
          });
        }
      } catch (err) {
        console.error("Gagal memuat data Tentang Kami:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAboutData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4500);
  };

  // Handler Upload Foto ke Firebase Storage
  const handleUploadPhoto = async (file, fieldPath, setProgressState) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (PNG, JPG, JPEG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5MB.");
      return;
    }

    try {
      setProgressState(true);
      const storageRef = ref(
        storage,
        `site_content/about/${fieldPath.replace(".", "_")}_${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Upload error:", error);
          alert("Gagal mengunggah foto: " + error.message);
          setProgressState(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (fieldPath === "history.photo") {
            setFormData((prev) => ({
              ...prev,
              history: { ...prev.history, photo: downloadUrl },
            }));
          } else if (fieldPath === "why.mockupImage") {
            setFormData((prev) => ({
              ...prev,
              why: { ...prev.why, mockupImage: downloadUrl },
            }));
          }
          setProgressState(false);
          showToast("Foto berhasil diunggah!");
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan saat mengunggah foto: " + err.message);
      setProgressState(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleHistoryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      history: { ...prev.history, [field]: value },
    }));
  };

  const handleWhyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      why: { ...prev.why, [field]: value },
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.why.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      why: { ...prev.why, features: updatedFeatures },
    }));
  };

  const handleConsultationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      consultation: { ...prev.consultation, [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        lastUpdated: serverTimestamp()
      };

      await setDoc(doc(db, "articles", "__page_about"), payload, { merge: true });

      try {
        await setDoc(doc(db, "site_content", "about"), payload, { merge: true });
      } catch {}

      showToast("Data Halaman Tentang Kami berhasil disimpan ke Firebase!");
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      alert("Gagal menyimpan data: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = () => {
    if (window.confirm("Kembalikan konten halaman Tentang Kami ke pengaturan bawaan resmi Ayo Kasbon?")) {
      setFormData(DEFAULT_ABOUT_DATA);
      showToast("Formulir telah direset ke nilai default.");
    }
  };

  if (loading) {
    return (
      <div className="cms-page-container">
        <div className="cms-loading-state">
          <div className="cms-spinner" />
          <p>Memuat Konfigurasi Halaman Tentang Kami...</p>
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
          <h1 className="cms-page-title">Pengelola Halaman Tentang Kami</h1>
          <p className="cms-page-subtitle">
            Kelola teks hero visi perusahaan, foto tim sejarah pendiri, kartu 3 pilar keunggulan, serta banner penawaran konsultasi CS.
          </p>
        </div>

        <div className="cms-header-actions">
          <a
            href="http://localhost:5175/tentang-kami"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
          >
            <ExternalLink size={16} />
            <span>Lihat Halaman Live</span>
          </a>

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

      {/* Navigasi Submenu / Tab */}
      <div className="cms-tabs-bar">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = section === tab.id;
          return (
            <Link
              key={tab.id}
              to={`/about/${tab.id}`}
              className={`cms-tab-btn ${isActive ? "active" : ""}`}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* TAB 1: HERO TENTANG KAMI */}
      {section === "hero" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 1: Hero Profil & Visi Perusahaan</h3>
              <p>Kelola judul banner utama, deskripsi misi, kata kunci yang disorot, dan tombol ajakan bertindak (CTA).</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke /tentang-kami</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Utama Hero</label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => handleHeroChange("title", e.target.value)}
                placeholder="Tentang Kami"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Kata Sorotan Berwarna (Highlight)</label>
              <input
                type="text"
                value={formData.hero.highlightWord}
                onChange={(e) => handleHeroChange("highlightWord", e.target.value)}
                placeholder="Platform Kasbon Instan"
                className="form-input"
              />
              <span className="form-hint-text">Frasa di dalam deskripsi yang diberi efek highlight.</span>
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">3. Paragraf Deskripsi Visi & Misi</label>
              <textarea
                rows={4}
                value={formData.hero.description}
                onChange={(e) => handleHeroChange("description", e.target.value)}
                placeholder="Tuliskan dedikasi dan komitmen Ayo Kasbon..."
                className="form-textarea"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">4. Teks Tombol Utama (Primary CTA)</label>
              <input
                type="text"
                value={formData.hero.primaryBtnText}
                onChange={(e) => handleHeroChange("primaryBtnText", e.target.value)}
                placeholder="Mulai Sekarang"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">5. Tautan Tombol Utama</label>
              <input
                type="text"
                value={formData.hero.primaryBtnLink}
                onChange={(e) => handleHeroChange("primaryBtnLink", e.target.value)}
                placeholder="https://app.ayokasbon.com/"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">6. Teks Tombol Sekunder</label>
              <input
                type="text"
                value={formData.hero.secondaryBtnText}
                onChange={(e) => handleHeroChange("secondaryBtnText", e.target.value)}
                placeholder="Pelajari Sejarah Kami"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">7. Tautan Tombol Sekunder</label>
              <input
                type="text"
                value={formData.hero.secondaryBtnLink}
                onChange={(e) => handleHeroChange("secondaryBtnLink", e.target.value)}
                placeholder="#sejarah-perusahaan"
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEJARAH & FOTO TIM */}
      {section === "history" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 2: Sejarah Perusahaan & Dokumentasi Foto Tim</h3>
              <p>Kelola narasi pendirian, foto kantor/tim, nama pendiri, dan komitmen layanan.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke /tentang-kami</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Badge Tahun Pendirian</label>
              <input
                type="text"
                value={formData.history.badge}
                onChange={(e) => handleHistoryChange("badge", e.target.value)}
                placeholder="Didirikan Agustus 2023"
                className="form-input"
              />
              <span className="form-hint-text">Ditampilkan pada floating badge di atas foto tim.</span>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Subjudul / Eyebrow Text</label>
              <input
                type="text"
                value={formData.history.eyebrow}
                onChange={(e) => handleHistoryChange("eyebrow", e.target.value)}
                placeholder="Perjalanan & Komitmen Kami"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">3. Judul Section</label>
              <input
                type="text"
                value={formData.history.title}
                onChange={(e) => handleHistoryChange("title", e.target.value)}
                placeholder="Sejarah Perusahaan"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">4. Foto Tim Dokumentasi / Kantor</label>
              
              <div className="photo-editor-wrapper">
                <div className="photo-preview-box">
                  {formData.history.photo ? (
                    <img src={formData.history.photo} alt="Preview Foto Tim" className="preview-img-square" />
                  ) : (
                    <div className="default-photo-placeholder">
                      <ImageIcon size={28} className="text-blue" />
                      <span>Menggunakan Foto Tim Bawaan (team-history.png)</span>
                    </div>
                  )}

                  {formData.history.photo && (
                    <button
                      type="button"
                      onClick={() => handleHistoryChange("photo", "")}
                      className="btn-remove-photo"
                    >
                      <Trash2 size={14} />
                      <span>Gunakan Gambar Bawaan</span>
                    </button>
                  )}
                </div>

                <div className="photo-inputs-box">
                  <div className="upload-file-dropzone">
                    <input
                      type="file"
                      id="history-photo-input"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUploadPhoto(e.target.files[0], "history.photo", setUploadingHistoryPhoto);
                        }
                      }}
                    />
                    <label htmlFor="history-photo-input" className="btn-upload-file">
                      <Upload size={16} />
                      <span>{uploadingHistoryPhoto ? "Mengunggah..." : "Upload Foto Baru"}</span>
                    </label>
                  </div>

                  <div className="divider-or">
                    <span>atau masukkan URL gambar eksternal</span>
                  </div>

                  <div className="input-with-icon">
                    <Link2 size={16} className="input-icon" />
                    <input
                      type="url"
                      placeholder="https://contoh.com/foto-kantor.jpg"
                      value={formData.history.photo}
                      onChange={(e) => handleHistoryChange("photo", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">5. Paragraf Narasi Sejarah & Visi</label>
              <textarea
                rows={5}
                value={formData.history.paragraph}
                onChange={(e) => handleHistoryChange("paragraph", e.target.value)}
                placeholder="Tuliskan cerita perjalanan pendirian Ayo Kasbon..."
                className="form-textarea"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KENAPA AYO KASBON & 3 KARTU KEUNGGULAN */}
      {section === "why" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 3: Kenapa Harus Ayo Kasbon? (3 Kartu Pilar)</h3>
              <p>Kelola headline, gambar mockup aplikasi di sebelah kiri, dan rincian 3 kartu pilar keunggulan kasbon.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke /tentang-kami</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-full-col">
              <label className="form-label-bold">1. Judul Section</label>
              <input
                type="text"
                value={formData.why.title}
                onChange={(e) => handleWhyChange("title", e.target.value)}
                placeholder="Kenapa Harus Ayo Kasbon?"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">2. Gambar Mockup Aplikasi (Smartphone)</label>
              
              <div className="photo-editor-wrapper">
                <div className="photo-preview-box">
                  {formData.why.mockupImage ? (
                    <img src={formData.why.mockupImage} alt="Preview Mockup" className="preview-img-square" />
                  ) : (
                    <div className="default-photo-placeholder">
                      <ImageIcon size={28} className="text-blue" />
                      <span>Menggunakan Mockup Bawaan (why-mockup-phone.png)</span>
                    </div>
                  )}

                  {formData.why.mockupImage && (
                    <button
                      type="button"
                      onClick={() => handleWhyChange("mockupImage", "")}
                      className="btn-remove-photo"
                    >
                      <Trash2 size={14} />
                      <span>Gunakan Gambar Bawaan</span>
                    </button>
                  )}
                </div>

                <div className="photo-inputs-box">
                  <div className="upload-file-dropzone">
                    <input
                      type="file"
                      id="mockup-photo-input"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUploadPhoto(e.target.files[0], "why.mockupImage", setUploadingMockupPhoto);
                        }
                      }}
                    />
                    <label htmlFor="mockup-photo-input" className="btn-upload-file">
                      <Upload size={16} />
                      <span>{uploadingMockupPhoto ? "Mengunggah..." : "Upload Gambar Mockup"}</span>
                    </label>
                  </div>

                  <div className="divider-or">
                    <span>atau masukkan URL gambar mockup</span>
                  </div>

                  <div className="input-with-icon">
                    <Link2 size={16} className="input-icon" />
                    <input
                      type="url"
                      placeholder="https://contoh.com/mockup-app.png"
                      value={formData.why.mockupImage}
                      onChange={(e) => handleWhyChange("mockupImage", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-full-col">
              <label className="form-label-bold mb-3">3. Konfigurasi 3 Kartu Keunggulan</label>
              
              <div className="cards-editor-grid">
                {formData.why.features.map((feature, idx) => (
                  <div key={feature.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">KARTU #{idx + 1}</span>
                      <select
                        value={feature.iconType || "dollar"}
                        onChange={(e) => handleFeatureChange(idx, "iconType", e.target.value)}
                        className="select-icon-type"
                      >
                        <option value="dollar">Ikon: Dollar / Biaya Admin</option>
                        <option value="shield">Ikon: Shield / Syariah</option>
                        <option value="zap">Ikon: Zap / Cair Cepat</option>
                        <option value="check">Ikon: Centang / Aman</option>
                        <option value="heart">Ikon: Hati / Kesejahteraan</option>
                      </select>
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Judul Kartu</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                          placeholder="Judul Keunggulan"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div>
                        <label className="mini-label">Penjelasan / Deskripsi</label>
                        <textarea
                          rows={3}
                          value={feature.desc}
                          onChange={(e) => handleFeatureChange(idx, "desc", e.target.value)}
                          placeholder="Deskripsi keunggulan..."
                          className="form-textarea form-textarea-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BANNER KONSULTASI CS (CTA BANNER) */}
      {section === "consultation" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 4: Banner Konsultasi Gratis & Demo Aplikasi (CTA)</h3>
              <p>Kelola headline banner, ajakan konsultasi, dan link/nomor kontak tujuan.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke /tentang-kami</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Banner</label>
              <input
                type="text"
                value={formData.consultation.title}
                onChange={(e) => handleConsultationChange("title", e.target.value)}
                placeholder="Konsultasi Gratis dan Demo Aplikasi"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Subjudul / Keterangan Penawaran</label>
              <input
                type="text"
                value={formData.consultation.subtitle}
                onChange={(e) => handleConsultationChange("subtitle", e.target.value)}
                placeholder="Daftar Segera untuk Konsultasi"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">3. Teks Tombol Aksi (CTA)</label>
              <input
                type="text"
                value={formData.consultation.buttonText}
                onChange={(e) => handleConsultationChange("buttonText", e.target.value)}
                placeholder="Hubungi Kami"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">4. Tujuan Link Tombol</label>
              <input
                type="text"
                value={formData.consultation.buttonLink}
                onChange={(e) => handleConsultationChange("buttonLink", e.target.value)}
                placeholder="/hubungi-kami atau https://wa.me/62..."
                className="form-input"
              />
              <span className="form-hint-text">Bisa berupa link internal (/hubungi-kami) atau link WhatsApp.</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Quick Save */}
      <div className="cms-bottom-save-bar">
        <div className="save-bar-info">
          <span>Pastikan untuk menyimpan perubahan setelah mengedit formulir Tentang Kami.</span>
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
