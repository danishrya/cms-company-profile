import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { 
  Home as HomeIcon, 
  Sparkles, 
  Layers, 
  MessageSquareQuote, 
  ExternalLink,
  ImageIcon,
  Save,
  RotateCcw,
  Upload,
  Link2,
  Trash2,
  CheckCircle2,
  CreditCard,
  Gift,
  ShieldCheck,
  Zap,
  Check,
  HeartHandshake
} from "lucide-react";

// Default data resmi Beranda Ayo Kasbon
const DEFAULT_HOME_DATA = {
  hero: {
    headline: "Solusi Dana Darurat Karyawan,",
    highlight: "Aman dan Terpercaya",
    description: "Bantu karyawan hindari jeratan pinjol. Wujudkan perusahaan yang tumbuh sehat dengan akses gaji instan tanpa mengganggu arus kas bisnis Anda.",
    primaryBtnText: "Mulai Sekarang",
    primaryBtnLink: "https://app.ayokasbon.com/",
    secondaryBtnText: "Pelajari Cara Kerja",
    secondaryBtnLink: "#keunggulan",
    mockupImage: "", // Kosong = mockup-phone.svg bawaan
    statusBadge1: "Kasbon Berhasil Ditransfer",
    statusBadge2: "Rp 2.500.000"
  },
  features: {
    title: "Benefit Maksimal,",
    highlight: "Tanpa Beban Finansial.",
    subtitle: "AyoKasbon dirancang untuk memberikan ketenangan pikiran bagi karyawan sekaligus menjaga efisiensi operasional perusahaan Anda.",
    image: "", // Kosong = features-image.png bawaan
    list: [
      {
        id: 1,
        title: "Tanpa Bunga Pinjol",
        desc: "Murni akses gaji yang sudah menjadi hak karyawan",
        iconType: "shield"
      },
      {
        id: 2,
        title: "Otomasi Payroll",
        desc: "Murni akses gaji yang sudah menjadi hak karyawan",
        iconType: "payroll"
      },
      {
        id: 3,
        title: "Nol Risiko Perusahaan",
        desc: "Tidak menggunakan dana internal perusahaan.",
        iconType: "check"
      }
    ]
  },
  testimonials: {
    title: "Dipercaya oleh Para Karyawan",
    subtitle: "Pengalaman nyata dari mereka yang telah merasakan kemudahannya.",
    list: [
      {
        id: 1,
        name: "Andi",
        company: "Rumah Sakit Cikalong Wetan",
        quote: "Aplikasi yang sangat membantu ketika butuh dana darurat sebelum gajian.",
        initial: "A",
        color: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)"
      },
      {
        id: 2,
        name: "Budi",
        company: "Teleanjar Aware Payment",
        quote: "Mudah cara menggunakan aplikasinya dan proses pencairan sangat cepat.",
        initial: "B",
        color: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)"
      },
      {
        id: 3,
        name: "Citra",
        company: "Inpam Tekno",
        quote: "Aplikasi yang sangat membantu menjaga ketenangan finansial karyawan.",
        initial: "C",
        color: "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)"
      }
    ]
  },
  cta: {
    title: "Dapatkan Trial 30 Hari",
    desc: "Mulai transformasi kesejahteraan karyawan Anda hari ini. Nikmati akses penuh Ayo Kasbon gratis selama 30 hari. Tanpa komitmen, tanpa biaya tersembunyi.",
    btnText: "Hubungi Kami",
    btnLink: "/hubungi-kami",
    image: "" // Kosong = cta-image.svg bawaan
  }
};

export default function HomeManager() {
  const { section = "hero" } = useParams();

  const [formData, setFormData] = useState(DEFAULT_HOME_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Upload file loading states
  const [uploadingHeroMockup, setUploadingHeroMockup] = useState(false);
  const [uploadingFeatureImg, setUploadingFeatureImg] = useState(false);
  const [uploadingCtaImg, setUploadingCtaImg] = useState(false);

  const tabs = [
    { id: "hero", label: "Hero & Banner Utama", icon: Sparkles },
    { id: "features", label: "Card Layanan & Fitur", icon: Layers },
    { id: "testimonials", label: "Testimoni Karyawan", icon: MessageSquareQuote },
    { id: "cta", label: "Banner Trial (CTA)", icon: Gift },
  ];

  // Muat data dari Firestore
  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        let snap = await getDoc(doc(db, "articles", "__page_home"));
        if (!snap.exists()) {
          try {
            snap = await getDoc(doc(db, "site_content", "home"));
          } catch {}
        }

        if (snap.exists()) {
          const remoteData = snap.data();
          setFormData({
            hero: { ...DEFAULT_HOME_DATA.hero, ...remoteData.hero },
            features: {
              ...DEFAULT_HOME_DATA.features,
              ...remoteData.features,
              list: remoteData.features?.list?.length ? remoteData.features.list : DEFAULT_HOME_DATA.features.list
            },
            testimonials: {
              ...DEFAULT_HOME_DATA.testimonials,
              ...remoteData.testimonials,
              list: remoteData.testimonials?.list?.length ? remoteData.testimonials.list : DEFAULT_HOME_DATA.testimonials.list
            },
            cta: { ...DEFAULT_HOME_DATA.cta, ...remoteData.cta }
          });
        }
      } catch (err) {
        console.error("Gagal memuat data Beranda:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
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
      alert("Harap pilih file gambar (PNG, JPG, SVG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file gambar maksimal 5MB.");
      return;
    }

    try {
      setProgressState(true);
      const storageRef = ref(
        storage,
        `site_content/home/${fieldPath.replace(".", "_")}_${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Upload error:", error);
          alert("Gagal mengunggah gambar: " + error.message);
          setProgressState(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (fieldPath === "hero.mockupImage") {
            setFormData((prev) => ({
              ...prev,
              hero: { ...prev.hero, mockupImage: downloadUrl },
            }));
          } else if (fieldPath === "features.image") {
            setFormData((prev) => ({
              ...prev,
              features: { ...prev.features, image: downloadUrl },
            }));
          } else if (fieldPath === "cta.image") {
            setFormData((prev) => ({
              ...prev,
              cta: { ...prev.cta, image: downloadUrl },
            }));
          }
          setProgressState(false);
          showToast("Gambar berhasil diunggah dan disimpan ke form!");
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan saat mengunggah: " + err.message);
      setProgressState(false);
    }
  };

  // Form Field Handlers
  const handleHeroChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const handleFeatureMainChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, [field]: value },
    }));
  };

  const handleFeatureItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.features.list];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        features: { ...prev.features, list: updated },
      };
    });
  };

  const handleTestimonialMainChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: { ...prev.testimonials, [field]: value },
    }));
  };

  const handleTestimonialItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.testimonials.list];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        testimonials: { ...prev.testimonials, list: updated },
      };
    });
  };

  const handleCtaChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: value },
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

      // Simpan ke __page_home (izin baca publik terjamin)
      await setDoc(doc(db, "articles", "__page_home"), payload, { merge: true });

      // Simpan juga ke site_content/home
      try {
        await setDoc(doc(db, "site_content", "home"), payload, { merge: true });
      } catch {}

      showToast("✅ Berhasil disimpan! Halaman Beranda di website utama sudah diperbarui.");
    } catch (err) {
      console.error("Gagal menyimpan ke Firestore:", err);
      alert("Gagal menyimpan perubahan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = () => {
    if (window.confirm("Kembalikan semua teks dan gambar halaman Beranda ke data default resmi?")) {
      setFormData(DEFAULT_HOME_DATA);
      showToast("Form di-reset ke data bawaan. Klik Simpan Perubahan untuk menerapkannya!");
    }
  };

  if (loading) {
    return (
      <div className="cms-page-container">
        <div className="cms-table-loading" style={{ minHeight: "400px" }}>
          <div className="cms-spinner"></div>
          <p>Memuat data konfigurasi Beranda...</p>
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

          <h1 className="cms-page-title">Pengelola Halaman Beranda (Home)</h1>
          <p className="cms-page-subtitle">
            Kustomisasi banner hero utama, kartu keunggulan & layanan, testimoni karyawan, dan banner trial CTA.
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
            href="http://localhost:5173/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
          >
            <ExternalLink size={16} />
            <span>Lihat Beranda Live</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary-action"
          >
            {saving ? <div className="cms-spinner-sm" /> : <Save size={18} />}
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
              to={`/home/${tab.id}`}
              className={`cms-tab-item ${isActive ? "active" : ""}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERO & BANNER UTAMA                                                */}
      {/* ========================================================================= */}
      {section === "hero" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 1: Hero & Banner Utama</h3>
              <p>Atur headline utama, subjudul penjelasan, tombol aksi CTA, serta foto mockup smartphone.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Headline Utama (Baris 1)</label>
              <input
                type="text"
                value={formData.hero.headline}
                onChange={(e) => handleHeroChange("headline", e.target.value)}
                placeholder="Solusi Dana Darurat Karyawan,"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Highlight Teks (Baris 2 Berwarna)</label>
              <input
                type="text"
                value={formData.hero.highlight}
                onChange={(e) => handleHeroChange("highlight", e.target.value)}
                placeholder="Aman dan Terpercaya"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">3. Paragraf Deskripsi Penjelasan</label>
              <textarea
                rows={3}
                value={formData.hero.description}
                onChange={(e) => handleHeroChange("description", e.target.value)}
                placeholder="Bantu karyawan hindari jeratan pinjol..."
                className="form-textarea"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">4. Tombol Utama (Primary CTA)</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={formData.hero.primaryBtnText}
                  onChange={(e) => handleHeroChange("primaryBtnText", e.target.value)}
                  placeholder="Teks: Mulai Sekarang"
                  className="form-input"
                />
                <input
                  type="text"
                  value={formData.hero.primaryBtnLink}
                  onChange={(e) => handleHeroChange("primaryBtnLink", e.target.value)}
                  placeholder="Link: https://app.ayokasbon.com/"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">5. Tombol Kedua (Secondary CTA)</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={formData.hero.secondaryBtnText}
                  onChange={(e) => handleHeroChange("secondaryBtnText", e.target.value)}
                  placeholder="Teks: Pelajari Cara Kerja"
                  className="form-input"
                />
                <input
                  type="text"
                  value={formData.hero.secondaryBtnLink}
                  onChange={(e) => handleHeroChange("secondaryBtnLink", e.target.value)}
                  placeholder="Link: #keunggulan"
                  className="form-input"
                />
              </div>
            </div>

            {/* Mockup Smartphone Image */}
            <div className="form-full-col">
              <label className="form-label-bold">6. Gambar Mockup Smartphone Aplikasi</label>
              <p className="form-hint-text">Mockup smartphone di sebelah kanan hero banner.</p>

              <div className="photo-manager-layout">
                <div className="photo-preview-box mockup">
                  {formData.hero.mockupImage ? (
                    <img
                      src={formData.hero.mockupImage}
                      alt="Hero Mockup"
                      className="photo-preview-image contain"
                    />
                  ) : (
                    <div className="photo-preview-default">
                      <ImageIcon size={36} className="text-muted" />
                      <span>Mockup Smartphone Bawaan (mockup-phone.svg)</span>
                    </div>
                  )}
                  {formData.hero.mockupImage && (
                    <button
                      type="button"
                      onClick={() => handleHeroChange("mockupImage", "")}
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
                      id="hero-mockup-input"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUploadPhoto(e.target.files[0], "hero.mockupImage", setUploadingHeroMockup);
                        }
                      }}
                    />
                    <label htmlFor="hero-mockup-input" className="btn-upload-file">
                      <Upload size={16} />
                      <span>{uploadingHeroMockup ? "Mengunggah..." : "Upload Gambar Mockup"}</span>
                    </label>
                  </div>

                  <div className="divider-or">
                    <span>atau masukkan URL gambar</span>
                  </div>

                  <div className="input-with-icon">
                    <Link2 size={16} className="input-icon" />
                    <input
                      type="url"
                      placeholder="https://contoh.com/mockup-app.svg"
                      value={formData.hero.mockupImage}
                      onChange={(e) => handleHeroChange("mockupImage", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Badge floating pada mockup */}
            <div className="form-half-col">
              <label className="form-label-bold">7. Label Badge Melayang #1</label>
              <input
                type="text"
                value={formData.hero.statusBadge1}
                onChange={(e) => handleHeroChange("statusBadge1", e.target.value)}
                placeholder="Kasbon Berhasil Ditransfer"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">8. Label Badge Melayang #2</label>
              <input
                type="text"
                value={formData.hero.statusBadge2}
                onChange={(e) => handleHeroChange("statusBadge2", e.target.value)}
                placeholder="Rp 2.500.000"
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CARD LAYANAN & FITUR                                               */}
      {/* ========================================================================= */}
      {section === "features" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 2: Card Layanan & Keunggulan Utama</h3>
              <p>Kelola judul, subjudul, ilustrasi gambar, dan 3 kartu fitur keunggulan.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Bagian (Baris 1)</label>
              <input
                type="text"
                value={formData.features.title}
                onChange={(e) => handleFeatureMainChange("title", e.target.value)}
                placeholder="Benefit Maksimal,"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Highlight Judul (Baris 2 Biru)</label>
              <input
                type="text"
                value={formData.features.highlight}
                onChange={(e) => handleFeatureMainChange("highlight", e.target.value)}
                placeholder="Tanpa Beban Finansial."
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">3. Subjudul Bagian</label>
              <textarea
                rows={2}
                value={formData.features.subtitle}
                onChange={(e) => handleFeatureMainChange("subtitle", e.target.value)}
                placeholder="AyoKasbon dirancang untuk memberikan ketenangan pikiran..."
                className="form-textarea"
              />
            </div>

            {/* Gambar Ilustrasi Sisi Kiri */}
            <div className="form-full-col">
              <label className="form-label-bold">4. Gambar Ilustrasi Keunggulan</label>
              <div className="photo-manager-layout">
                <div className="photo-preview-box">
                  {formData.features.image ? (
                    <img
                      src={formData.features.image}
                      alt="Feature Visual"
                      className="photo-preview-image contain"
                    />
                  ) : (
                    <div className="photo-preview-default">
                      <ImageIcon size={36} className="text-muted" />
                      <span>Gambar Ilustrasi Bawaan (features-image.png)</span>
                    </div>
                  )}
                  {formData.features.image && (
                    <button
                      type="button"
                      onClick={() => handleFeatureMainChange("image", "")}
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
                      id="features-img-input"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUploadPhoto(e.target.files[0], "features.image", setUploadingFeatureImg);
                        }
                      }}
                    />
                    <label htmlFor="features-img-input" className="btn-upload-file">
                      <Upload size={16} />
                      <span>{uploadingFeatureImg ? "Mengunggah..." : "Upload Gambar Ilustrasi"}</span>
                    </label>
                  </div>

                  <div className="divider-or">
                    <span>atau masukkan URL gambar</span>
                  </div>

                  <div className="input-with-icon">
                    <Link2 size={16} className="input-icon" />
                    <input
                      type="url"
                      placeholder="https://contoh.com/features-image.png"
                      value={formData.features.image}
                      onChange={(e) => handleFeatureMainChange("image", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* List 3 Kartu Keunggulan */}
            <div className="form-full-col">
              <label className="form-label-bold mb-3">5. Konfigurasi 3 Kartu Keunggulan</label>
              
              <div className="cards-editor-grid">
                {formData.features.list.map((item, idx) => (
                  <div key={item.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">KARTU #{idx + 1}</span>
                      <select
                        value={item.iconType || "shield"}
                        onChange={(e) => handleFeatureItemChange(idx, "iconType", e.target.value)}
                        className="select-icon-type"
                      >
                        <option value="shield">Ikon: Shield / Keamanan</option>
                        <option value="payroll">Ikon: Payroll / Kartu</option>
                        <option value="check">Ikon: Centang / Nol Risiko</option>
                        <option value="zap">Ikon: Petir / Instan</option>
                        <option value="dollar">Ikon: Dollar / Keuangan</option>
                      </select>
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Judul Kartu</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleFeatureItemChange(idx, "title", e.target.value)}
                          placeholder="Judul Fitur"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div>
                        <label className="mini-label">Penjelasan Singkat</label>
                        <textarea
                          rows={3}
                          value={item.desc}
                          onChange={(e) => handleFeatureItemChange(idx, "desc", e.target.value)}
                          placeholder="Deskripsi..."
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
      {/* TAB 3: TESTIMONI KARYAWAN                                                 */}
      {/* ========================================================================= */}
      {section === "testimonials" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 3: Testimoni & Ulasan Karyawan</h3>
              <p>Kelola judul, ulasan karyawan, nama perusahaan, serta inisial profil.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Bagian</label>
              <input
                type="text"
                value={formData.testimonials.title}
                onChange={(e) => handleTestimonialMainChange("title", e.target.value)}
                placeholder="Dipercaya oleh Para Karyawan"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Subjudul Bagian</label>
              <input
                type="text"
                value={formData.testimonials.subtitle}
                onChange={(e) => handleTestimonialMainChange("subtitle", e.target.value)}
                placeholder="Pengalaman nyata dari mereka..."
                className="form-input"
              />
            </div>

            {/* List 3 Testimoni */}
            <div className="form-full-col">
              <label className="form-label-bold mb-3">3. Daftar Ulasan Testimoni (3 Kartu)</label>

              <div className="cards-editor-grid">
                {formData.testimonials.list.map((item, idx) => (
                  <div key={item.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">TESTIMONI #{idx + 1}</span>
                      <span className="text-xs text-muted">Bintang 5</span>
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Nama Pengguna</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleTestimonialItemChange(idx, "name", e.target.value)}
                          placeholder="Nama Karyawan"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="mini-label">Nama Perusahaan / Instansi</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => handleTestimonialItemChange(idx, "company", e.target.value)}
                          placeholder="Nama Perusahaan"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div>
                        <label className="mini-label">Isi Kutipan Ulasan</label>
                        <textarea
                          rows={3}
                          value={item.quote}
                          onChange={(e) => handleTestimonialItemChange(idx, "quote", e.target.value)}
                          placeholder="Kutipan ulasan..."
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
      {/* TAB 4: BANNER TRIAL (CTA)                                                 */}
      {/* ========================================================================= */}
      {section === "cta" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 4: Banner Penawaran Trial 30 Hari (CTA)</h3>
              <p>Kelola headline penawaran trial gratis, teks penjelasan, tombol aksi, dan gambar banner.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Banner</label>
              <input
                type="text"
                value={formData.cta.title}
                onChange={(e) => handleCtaChange("title", e.target.value)}
                placeholder="Dapatkan Trial 30 Hari"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Teks Tombol Aksi (CTA)</label>
              <input
                type="text"
                value={formData.cta.btnText}
                onChange={(e) => handleCtaChange("btnText", e.target.value)}
                placeholder="Hubungi Kami"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">3. Tujuan Link Tombol</label>
              <input
                type="text"
                value={formData.cta.btnLink}
                onChange={(e) => handleCtaChange("btnLink", e.target.value)}
                placeholder="/hubungi-kami atau https://wa.me/62..."
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">4. Gambar Banner CTA</label>
              <div className="d-flex gap-2 align-center mt-1">
                <input
                  type="text"
                  value={formData.cta.image}
                  onChange={(e) => handleCtaChange("image", e.target.value)}
                  placeholder="URL Gambar (Kosongkan untuk bawaan)"
                  className="form-input"
                />
                {formData.cta.image && (
                  <button
                    type="button"
                    onClick={() => handleCtaChange("image", "")}
                    className="btn-remove-photo"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">5. Penjelasan Penawaran</label>
              <textarea
                rows={3}
                value={formData.cta.desc}
                onChange={(e) => handleCtaChange("desc", e.target.value)}
                placeholder="Mulai transformasi kesejahteraan karyawan Anda hari ini..."
                className="form-textarea"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Quick Save */}
      <div className="cms-bottom-save-bar">
        <div className="save-bar-info">
          <span>Pastikan untuk menyimpan perubahan setelah mengedit formulir Beranda.</span>
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
