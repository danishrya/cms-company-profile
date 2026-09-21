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
  HeartHandshake
} from "lucide-react";

// Default content bawaan resmi Ayo Kasbon
const DEFAULT_ABOUT_DATA = {
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
  const { section = "history" } = useParams();

  const [formData, setFormData] = useState(DEFAULT_ABOUT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // State upload file
  const [uploadingHistoryPhoto, setUploadingHistoryPhoto] = useState(false);
  const [uploadingMockupPhoto, setUploadingMockupPhoto] = useState(false);
  const [uploadingCsPhoto, setUploadingCsPhoto] = useState(false);

  const tabs = [
    { id: "history", label: "Sejarah & Foto Tim", icon: ImageIcon },
    { id: "why", label: "Kenapa Ayo Kasbon (Cards)", icon: Layers },
    { id: "consultation", label: "Banner Konsultasi CS", icon: PhoneCall },
  ];

  // Muat data dari Firestore
  useEffect(() => {
    async function loadAboutData() {
      try {
        setLoading(true);
        // Cek __page_about di articles
        let snap = await getDoc(doc(db, "articles", "__page_about"));
        if (!snap.exists()) {
          try {
            snap = await getDoc(doc(db, "site_content", "about"));
          } catch (e) {
            // ignore
          }
        }

        if (snap.exists()) {
          const remoteData = snap.data();
          setFormData({
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

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (PNG, JPG, JPEG, WebP).");
      return;
    }

    // Validasi ukuran file (maks 5MB)
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
        (snapshot) => {},
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
          } else if (fieldPath === "consultation.bannerImage") {
            setFormData((prev) => ({
              ...prev,
              consultation: { ...prev.consultation, bannerImage: downloadUrl },
            }));
          }
          setProgressState(false);
          showToast("Foto berhasil diunggah dan disimpan ke form!");
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan saat mengunggah foto: " + err.message);
      setProgressState(false);
    }
  };

  // Handler Perubahan Input History
  const handleHistoryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      history: { ...prev.history, [field]: value },
    }));
  };

  // Handler Perubahan Input Why
  const handleWhyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      why: { ...prev.why, [field]: value },
    }));
  };

  // Handler Perubahan Card Feature
  const handleFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.why.features];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        why: { ...prev.why, features: updated },
      };
    });
  };

  // Handler Perubahan Consultation
  const handleConsultationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      consultation: { ...prev.consultation, [field]: value },
    }));
  };

  // Simpan Semua Perubahan ke Firestore
  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        isPageConfig: true,
        updatedAt: serverTimestamp(),
      };

      // 1. Simpan ke __page_about (izin baca publik terjamin)
      await setDoc(doc(db, "articles", "__page_about"), payload, { merge: true });

      // 2. Simpan juga ke site_content/about
      try {
        await setDoc(doc(db, "site_content", "about"), payload, { merge: true });
      } catch (e) {
        // ignore jika aturan site_content dibatasi
      }

      showToast("✅ Berhasil disimpan! Halaman Tentang Kami di website utama sudah diperbarui secara langsung.");
    } catch (err) {
      console.error("Gagal menyimpan ke Firestore:", err);
      alert("Gagal menyimpan perubahan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reset ke data default resmi
  const handleResetDefault = () => {
    if (window.confirm("Kembalikan semua teks dan foto halaman Tentang Kami ke data default resmi?")) {
      setFormData(DEFAULT_ABOUT_DATA);
      showToast("Form di-reset ke nilai default bawaan. Jangan lupa klik Simpan Perubahan!");
    }
  };

  if (loading) {
    return (
      <div className="cms-page-container">
        <div className="cms-table-loading" style={{ minHeight: "400px" }}>
          <div className="cms-spinner"></div>
          <p>Memuat data konfigurasi Tentang Kami...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-page-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`cms-floating-toast ${toast.type}`}>
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="cms-page-header">
        <div>

          <h1 className="cms-page-title">Pengelola Halaman Tentang Kami</h1>
          <p className="cms-page-subtitle">
            Kustomisasi foto dokumentasi tim/kantor, cerita sejarah pendiri, kartu keunggulan, dan banner konsultasi CS.
          </p>
        </div>

        <div className="cms-header-actions">
          <button 
            type="button" 
            onClick={handleResetDefault}
            className="btn-secondary-action"
            title="Reset ke nilai awal bawaan"
          >
            <RotateCcw size={16} />
            <span>Reset Bawaan</span>
          </button>

          <a
            href="http://localhost:5173/tentang-kami"
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
            {saving ? (
              <div className="cms-spinner-sm" />
            ) : (
              <Save size={18} />
            )}
            <span>{saving ? "Menyimpan ke Firebase..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="cms-tabs-container mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = section === tab.id;
          return (
            <Link
              key={tab.id}
              to={`/about/${tab.id}`}
              className={`cms-tab-item ${isActive ? "active" : ""}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SEJARAH & FOTO DOKUMENTASI TIM                                     */}
      {/* ========================================================================= */}
      {section === "history" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 1: Sejarah & Foto Dokumentasi Tim / Kantor</h3>
              <p>Atur foto dokumentasi kantor, tahun pendirian, nama para pendiri, dan narasi sejarah.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke /tentang-kami</span>
          </div>

          <div className="form-grid-layout">
            {/* Foto Tim Upload / URL */}
            <div className="form-full-col">
              <label className="form-label-bold">
                1. Foto Dokumentasi Tim & Kantor
              </label>
              <p className="form-hint-text">
                Foto ini akan tampil di samping teks sejarah perusahaan. Anda dapat mengunggah file gambar baru atau memasukkan URL gambar.
              </p>

              <div className="photo-manager-layout">
                {/* Preview Box */}
                <div className="photo-preview-box">
                  {formData.history.photo ? (
                    <img
                      src={formData.history.photo}
                      alt="Preview Foto Tim"
                      className="photo-preview-image"
                    />
                  ) : (
                    <div className="photo-preview-default">
                      <ImageIcon size={40} className="text-muted" />
                      <span>Menggunakan Foto Bawaan Tim (team-history.png)</span>
                    </div>
                  )}
                  {formData.history.photo && (
                    <button
                      type="button"
                      onClick={() => handleHistoryChange("photo", "")}
                      className="btn-remove-photo"
                      title="Kembalikan ke foto bawaan"
                    >
                      <Trash2 size={14} />
                      <span>Gunakan Foto Bawaan</span>
                    </button>
                  )}
                </div>

                {/* Upload & URL Inputs */}
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
                      <span>{uploadingHistoryPhoto ? "Mengunggah ke Firebase Storage..." : "Upload Foto dari Komputer"}</span>
                    </label>
                    <span className="upload-help-note">Format: PNG, JPG, JPEG, WebP (Maks 5MB)</span>
                  </div>

                  <div className="divider-or">
                    <span>atau masukkan URL gambar langsung</span>
                  </div>

                  <div className="input-with-icon">
                    <Link2 size={16} className="input-icon" />
                    <input
                      type="url"
                      placeholder="https://contoh-domain.com/foto-tim.jpg"
                      value={formData.history.photo}
                      onChange={(e) => handleHistoryChange("photo", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Badge & Eyebrow */}
            <div className="form-half-col">
              <label className="form-label-bold">2. Badge Floating (Pill Tanggal)</label>
              <input
                type="text"
                value={formData.history.badge}
                onChange={(e) => handleHistoryChange("badge", e.target.value)}
                placeholder="Contoh: Didirikan Agustus 2023"
                className="form-input"
              />
              <span className="form-hint-text">Teks kecil di atas foto sejarah</span>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">3. Label Subtitle (Eyebrow)</label>
              <input
                type="text"
                value={formData.history.eyebrow}
                onChange={(e) => handleHistoryChange("eyebrow", e.target.value)}
                placeholder="Contoh: Perjalanan & Komitmen Kami"
                className="form-input"
              />
            </div>

            {/* Judul & Nama Pendiri */}
            <div className="form-half-col">
              <label className="form-label-bold">4. Judul Bagian</label>
              <input
                type="text"
                value={formData.history.title}
                onChange={(e) => handleHistoryChange("title", e.target.value)}
                placeholder="Contoh: Sejarah Perusahaan"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">5. Nama Pendiri yang Di-Highlight</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={formData.history.founder1}
                  onChange={(e) => handleHistoryChange("founder1", e.target.value)}
                  placeholder="Pendiri 1 (Ari Gunawan)"
                  className="form-input"
                />
                <input
                  type="text"
                  value={formData.history.founder2}
                  onChange={(e) => handleHistoryChange("founder2", e.target.value)}
                  placeholder="Pendiri 2 (Tona Mahfirohman)"
                  className="form-input"
                />
              </div>
            </div>

            {/* Narasi Cerita Lengkap */}
            <div className="form-full-col">
              <label className="form-label-bold">6. Paragraf Narasi Sejarah Lengkap</label>
              <textarea
                rows={5}
                value={formData.history.paragraph}
                onChange={(e) => handleHistoryChange("paragraph", e.target.value)}
                placeholder="Ceritakan sejarah dan visi awal perusahaan..."
                className="form-textarea"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KENAPA HARUS AYO KASBON? (CARDS & MOCKUP)                          */}
      {/* ========================================================================= */}
      {section === "why" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 2: Kenapa Harus Ayo Kasbon? (3 Kartu Keunggulan)</h3>
              <p>Kelola judul, foto mockup smartphone aplikasi, serta judul & deskripsi 3 pilar keunggulan.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke /tentang-kami</span>
          </div>

          <div className="form-grid-layout">
            {/* Judul Bagian */}
            <div className="form-full-col">
              <label className="form-label-bold">1. Judul Bagian</label>
              <input
                type="text"
                value={formData.why.title}
                onChange={(e) => handleWhyChange("title", e.target.value)}
                placeholder="Kenapa Harus Ayo Kasbon?"
                className="form-input"
              />
            </div>

            {/* Foto Mockup Smartphone */}
            <div className="form-full-col">
              <label className="form-label-bold">2. Foto Mockup Smartphone Aplikasi</label>
              <p className="form-hint-text">Tampil di kolom kanan mendampingi ketiga kartu keunggulan.</p>
              
              <div className="photo-manager-layout">
                <div className="photo-preview-box mockup">
                  {formData.why.mockupImage ? (
                    <img
                      src={formData.why.mockupImage}
                      alt="Mockup Phone"
                      className="photo-preview-image contain"
                    />
                  ) : (
                    <div className="photo-preview-default">
                      <ImageIcon size={36} className="text-muted" />
                      <span>Mockup Smartphone Bawaan (why-mockup-phone.png)</span>
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

            {/* List 3 Kartu Keunggulan */}
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

      {/* ========================================================================= */}
      {/* TAB 3: BANNER KONSULTASI CS (CTA BANNER)                                   */}
      {/* ========================================================================= */}
      {section === "consultation" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 3: Banner Konsultasi Gratis & Demo Aplikasi (CTA)</h3>
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
          <span>Pastikan untuk menyimpan perubahan setelah mengedit formulir.</span>
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
