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
  Plus,
  CheckCircle2,
  Gift,
  Building2,
  Award,
  Monitor,
  LayoutGrid,
  Video,
  PlayCircle
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
    secondaryBtnLink: "#panduan",
    mockupImage: "", // Kosong = mockup-phone.svg bawaan
    statusBadge1: "Kasbon Berhasil Ditransfer",
    statusBadge2: "Rp 2.500.000"
  },
  partnership: {
    title: "Sudah dipakai oleh perusahaan terkemuka",
    list: [
      { id: 1, name: "Partner Satu", logoUrl: "" },
      { id: 2, name: "Partner Dua", logoUrl: "" },
      { id: 4, name: "Partner Tiga", logoUrl: "" },
      { id: 5, name: "Partner Empat", logoUrl: "" }
    ]
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
  quote: {
    title: "Dana Darurat Bukan Utang.",
    text: "Hentikan siklus pinjol, turnover karyawan dan absensi tinggi. Digitalisasi sistem kasbon anda untuk menciptakan ekosistem kerja yang lebih sehat dan produktif."
  },
  value: {
    title: "Nilai Lebih yang Kami Berikan.",
    subtitle: "Inovasi yang berfokus pada kemudahan dan ketenangan Anda.",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.kasbon.id",
    webAppUrl: "https://app.ayokasbon.com/",
    list: [
      {
        id: 1,
        title: "Dana Darurat dalam Hitungan Menit, Bukan Hari",
        desc: "Ketika karyawan menghadapi emergency, setiap menit berharga. Ayo Kasbon memastikan dana cair instant ke rekening karyawan 24/7.",
        iconType: "lightning"
      },
      {
        id: 2,
        title: "Langkah Sederhana, Tanpa Dokumen Ribet",
        desc: "Tidak ada formulir panjang, tidak ada fotokopi KTP berkali-kali, tidak ada jaminan. Cukup beberapa tap hanya dari smartphone.",
        iconType: "mobile"
      },
      {
        id: 3,
        title: "Pembayaran Otomatis Tanpa Repot",
        desc: "Karyawan tidak perlu ingat-ingat tanggal bayar, tidak perlu transfer manual, tidak ada denda keterlambatan. Semuanya otomatis.",
        iconType: "auto"
      },
      {
        id: 4,
        title: "Proteksi Berlapis untuk Data & Privasi",
        desc: "Ayo Kasbon menggunakan standar keamanan setara perbankan.",
        iconType: "shield"
      },
      {
        id: 5,
        title: "0% Bunga, Denda dan Biaya Tersembunyi",
        desc: "Ini bukan pinjaman. Ini adalah akses ke gaji yang sudah Anda kerjakan.",
        iconType: "percent"
      },
      {
        id: 6,
        title: "Customer Support yang Peduli",
        desc: "Tim kami siap membantu kapan pun Anda membutuhkan.",
        iconType: "support"
      }
    ]
  },
  monitor: {
    title: "Pantau Transaksi Secara Realtime",
    subtitle: "Debitur dan Kreditur Dapat Memantau Kasbon Karyawan",
    infoTitle: "Visibilitas Penuh",
    infoDesc: "Pantau total pengajuan, status pencairan dana, dan rincian transaksi secara transparan dalam satu dasbor pintar yang mudah dipahami.",
    mockupImage: "", // Kosong = mockup-dashboard.png bawaan
    notifHeading: "Berhasil",
    notifDesc: "Kasbon Berhasil Diterima"
  },
  otherBenefits: {
    title: "Benefit Lain Dari AyoKasbon",
    subtitle: "Lebih dari sekadar aplikasi kasbon. Kami merancang ekosistem lengkap untuk mendukung kesejahteraan finansial perusahaan Anda.",
    list: [
      {
        id: 1,
        title: "Integrasi Payroll Otomatis",
        desc: "Sinkronisasi data karyawan dengan sistem penggajian perusahaan dalam hitungan menit. Tanpa entri data manual, tanpa risiko human error.",
        iconType: "payroll",
        isComingSoon: false
      },
      {
        id: 2,
        title: "Akses Gaji Mandiri (EWA)",
        desc: "Karyawan dapat menarik persentase gaji yang telah mereka kerjakan kapanpun dibutuhkan. Solusi instan untuk dana darurat tanpa birokrasi kantor.",
        iconType: "ewa",
        isComingSoon: false
      },
      {
        id: 3,
        title: "Sistem Enkripsi Data",
        desc: "Perlindungan data pribadi karyawan dan perusahaan dengan standar keamanan siber. Kerahasiaan adalah prioritas kami.",
        iconType: "encryption",
        isComingSoon: false
      },
      {
        id: 4,
        title: "Pembayaran Tagihan",
        desc: "Bantu karyawan mengelola kebutuhan harian sebelum jatuh tempo. Bayar tagihan dari aplikasi praktis, aman, dan tanpa perlu menunggu tanggal gajian.",
        iconType: "bills",
        isComingSoon: false
      },
      {
        id: 5,
        title: "Dasbor Analitik HRD",
        desc: "Pantau kesehatan finansial organisasi secara agregat dan anonim. Dapatkan data real-time untuk pengambilan keputusan strategis SDM.",
        iconType: "analytics",
        isComingSoon: false
      },
      {
        id: 6,
        title: "Dana Perlindungan Keluarga",
        desc: "Fasilitas proteksi darurat tambahan untuk situasi kritis di luar dugaan demi menjamin ketenangan keluarga karyawan.",
        iconType: "community",
        isComingSoon: true
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
  },
  videoGuide: {
    badge: "Panduan Interaktif",
    title: "Lebih Dekat dengan AyoKasbon",
    subtitle: "Geser untuk menjelajahi ekosistem kesejahteraan finansial kami melalui seri video panduan berikut.",
    videos: [
      {
        id: 1,
        filename: "presentasi-v3.mp4",
        youtubeId: "P2UQiwnUT6o"
      },
      {
        id: 2,
        filename: "akses-gaji-awal.mp4",
        youtubeId: "Afv0GhVjeho"
      },
      {
        id: 3,
        filename: "tutorial-hrd.mp4",
        youtubeId: "dQw4w9WgXcQ"
      }
    ]
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
  const [uploadingMonitorMockup, setUploadingMonitorMockup] = useState(false);
  const [uploadingPartnerIdx, setUploadingPartnerIdx] = useState(null);

  const tabs = [
    { id: "hero", label: "1. Hero Banner", icon: Sparkles },
    { id: "partnership", label: "2. Mitra / Partner", icon: Building2 },
    { id: "features", label: "3. Layanan & Fitur", icon: Layers },
    { id: "quote", label: "4. Kutipan & Visi", icon: MessageSquareQuote },
    { id: "value", label: "5. Nilai Lebih", icon: Award },
    { id: "monitor", label: "6. Pantau Transaksi", icon: Monitor },
    { id: "otherBenefits", label: "7. Keuntungan Lain", icon: LayoutGrid },
    { id: "testimonials", label: "8. Testimoni", icon: MessageSquareQuote },
    { id: "cta", label: "9. Banner Trial (CTA)", icon: Gift },
    { id: "videoGuide", label: "10. Panduan Video", icon: Video },
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
            partnership: {
              ...DEFAULT_HOME_DATA.partnership,
              ...remoteData.partnership,
              list: remoteData.partnership?.list?.length ? remoteData.partnership.list : DEFAULT_HOME_DATA.partnership.list
            },
            features: {
              ...DEFAULT_HOME_DATA.features,
              ...remoteData.features,
              list: remoteData.features?.list?.length ? remoteData.features.list : DEFAULT_HOME_DATA.features.list
            },
            quote: { ...DEFAULT_HOME_DATA.quote, ...remoteData.quote },
            value: {
              ...DEFAULT_HOME_DATA.value,
              ...remoteData.value,
              list: remoteData.value?.list?.length ? remoteData.value.list : DEFAULT_HOME_DATA.value.list
            },
            monitor: { ...DEFAULT_HOME_DATA.monitor, ...remoteData.monitor },
            otherBenefits: {
              ...DEFAULT_HOME_DATA.otherBenefits,
              ...remoteData.otherBenefits,
              list: remoteData.otherBenefits?.list?.length ? remoteData.otherBenefits.list : DEFAULT_HOME_DATA.otherBenefits.list
            },
            testimonials: {
              ...DEFAULT_HOME_DATA.testimonials,
              ...remoteData.testimonials,
              list: remoteData.testimonials?.list?.length ? remoteData.testimonials.list : DEFAULT_HOME_DATA.testimonials.list
            },
            cta: { ...DEFAULT_HOME_DATA.cta, ...remoteData.cta },
            videoGuide: {
              ...DEFAULT_HOME_DATA.videoGuide,
              ...remoteData.videoGuide,
              videos: remoteData.videoGuide?.videos?.length ? remoteData.videoGuide.videos : DEFAULT_HOME_DATA.videoGuide.videos
            }
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
  const handleUploadPhoto = async (file, onUploaded, setProgressState) => {
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
      if (setProgressState) setProgressState(true);
      const storageRef = ref(
        storage,
        `site_content/home/${Date.now()}_${file.name.replace(/\s+/g, "_")}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Upload error:", error);
          alert("Gagal mengunggah gambar: " + error.message);
          if (setProgressState) setProgressState(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (typeof onUploaded === "function") {
            onUploaded(downloadUrl);
          }
          if (setProgressState) setProgressState(false);
          showToast("Gambar berhasil diunggah!");
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan saat mengunggah: " + err.message);
      if (setProgressState) setProgressState(false);
    }
  };

  // --- Handlers Tab Hero ---
  const handleHeroChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  // --- Handlers Tab Partnership ---
  const handlePartnerMainChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      partnership: { ...prev.partnership, [field]: value },
    }));
  };

  const handlePartnerItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.partnership.list];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        partnership: { ...prev.partnership, list: updated },
      };
    });
  };

  const handleAddPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partnership: {
        ...prev.partnership,
        list: [
          ...prev.partnership.list,
          { id: Date.now(), name: "Partner Baru", logoUrl: "" }
        ]
      }
    }));
  };

  const handleDeletePartner = (index) => {
    setFormData((prev) => {
      const updated = prev.partnership.list.filter((_, idx) => idx !== index);
      return {
        ...prev,
        partnership: { ...prev.partnership, list: updated }
      };
    });
  };

  // --- Handlers Tab Features ---
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

  // --- Handlers Tab Quote ---
  const handleQuoteChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      quote: { ...prev.quote, [field]: value },
    }));
  };

  // --- Handlers Tab Value ---
  const handleValueMainChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      value: { ...prev.value, [field]: value },
    }));
  };

  const handleValueItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.value.list];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        value: { ...prev.value, list: updated },
      };
    });
  };

  const handleAddValueItem = () => {
    setFormData((prev) => ({
      ...prev,
      value: {
        ...prev.value,
        list: [
          ...prev.value.list,
          { id: Date.now(), title: "Keunggulan Baru", desc: "Deskripsi singkat keunggulan...", iconType: "lightning" }
        ]
      }
    }));
  };

  const handleDeleteValueItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      value: {
        ...prev.value,
        list: prev.value.list.filter((_, idx) => idx !== index)
      }
    }));
  };

  // --- Handlers Tab Monitor Transactions ---
  const handleMonitorChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      monitor: { ...prev.monitor, [field]: value },
    }));
  };

  // --- Handlers Tab Other Benefits ---
  const handleOtherBenefitsMainChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      otherBenefits: { ...prev.otherBenefits, [field]: value },
    }));
  };

  const handleOtherBenefitsItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.otherBenefits.list];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        otherBenefits: { ...prev.otherBenefits, list: updated },
      };
    });
  };

  const handleAddBenefitItem = () => {
    setFormData((prev) => ({
      ...prev,
      otherBenefits: {
        ...prev.otherBenefits,
        list: [
          ...prev.otherBenefits.list,
          { id: Date.now(), title: "Benefit Tambahan", desc: "Penjelasan benefit baru...", iconType: "payroll", isComingSoon: false }
        ]
      }
    }));
  };

  const handleDeleteBenefitItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      otherBenefits: {
        ...prev.otherBenefits,
        list: prev.otherBenefits.list.filter((_, idx) => idx !== index)
      }
    }));
  };

  // --- Handlers Tab Testimonials ---
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

  // --- Handlers Tab CTA ---
  const handleCtaChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      cta: { ...prev.cta, [field]: value },
    }));
  };

  // --- Handlers Tab Video Guide ---
  const handleVideoMainChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      videoGuide: { ...prev.videoGuide, [field]: value },
    }));
  };

  const handleVideoItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.videoGuide.videos];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        videoGuide: { ...prev.videoGuide, videos: updated },
      };
    });
  };

  const handleAddVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videoGuide: {
        ...prev.videoGuide,
        videos: [
          ...prev.videoGuide.videos,
          { id: Date.now(), filename: `panduan-baru-${prev.videoGuide.videos.length + 1}.mp4`, youtubeId: "" }
        ]
      }
    }));
  };

  const handleDeleteVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      videoGuide: {
        ...prev.videoGuide,
        videos: prev.videoGuide.videos.filter((_, idx) => idx !== index)
      }
    }));
  };

  // Simpan ke Firestore
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

      showToast("Berhasil disimpan! Halaman Beranda di website utama sudah diperbarui.");
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
            Kustomisasi 10 section lengkap halaman Beranda AyoKasbon dari Hero, Mitra, Layanan, Nilai, Dashboard, hingga Video Guide.
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
            href="http://localhost:5175/"
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
      <div className="cms-tabs-container mb-4" style={{ flexWrap: "wrap", gap: "8px" }}>
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
                  placeholder="Teks Tombol (cth: Mulai Sekarang)"
                  className="form-input"
                />
                <input
                  type="text"
                  value={formData.hero.primaryBtnLink}
                  onChange={(e) => handleHeroChange("primaryBtnLink", e.target.value)}
                  placeholder="Link Tujuan (cth: https://app.ayokasbon.com/)"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">5. Tombol Sekunder (Secondary CTA)</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={formData.hero.secondaryBtnText}
                  onChange={(e) => handleHeroChange("secondaryBtnText", e.target.value)}
                  placeholder="Teks Tombol (cth: Pelajari Cara Kerja)"
                  className="form-input"
                />
                <input
                  type="text"
                  value={formData.hero.secondaryBtnLink}
                  onChange={(e) => handleHeroChange("secondaryBtnLink", e.target.value)}
                  placeholder="Link Tujuan (cth: #panduan)"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">6. Badge Melayang 1 (Notifikasi)</label>
              <input
                type="text"
                value={formData.hero.statusBadge1}
                onChange={(e) => handleHeroChange("statusBadge1", e.target.value)}
                placeholder="cth: Kasbon Berhasil Ditransfer"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">7. Badge Melayang 2 (Nominal)</label>
              <input
                type="text"
                value={formData.hero.statusBadge2}
                onChange={(e) => handleHeroChange("statusBadge2", e.target.value)}
                placeholder="cth: Rp 2.500.000"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">8. Gambar Mockup Smartphone</label>
              <div className="cms-image-upload-box">
                <div className="d-flex align-items-center gap-3">
                  {formData.hero.mockupImage ? (
                    <img 
                      src={formData.hero.mockupImage} 
                      alt="Mockup Phone Preview" 
                      className="cms-img-thumb"
                      style={{ maxHeight: "80px", maxWidth: "120px", objectFit: "contain" }}
                    />
                  ) : (
                    <div className="cms-img-placeholder">
                      <ImageIcon size={24} />
                      <span>Menggunakan SVG Bawaan</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.hero.mockupImage}
                      onChange={(e) => handleHeroChange("mockupImage", e.target.value)}
                      placeholder="URL Gambar Mockup (atau upload langsung dari file)"
                      className="form-input mb-2"
                    />

                    <div className="d-flex gap-2">
                      <label className="btn-upload-file">
                        <Upload size={14} />
                        <span>{uploadingHeroMockup ? "Mengunggah..." : "Upload File Mockup"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={uploadingHeroMockup}
                          onChange={(e) => handleUploadPhoto(
                            e.target.files[0], 
                            (url) => handleHeroChange("mockupImage", url), 
                            setUploadingHeroMockup
                          )}
                        />
                      </label>

                      {formData.hero.mockupImage && (
                        <button
                          type="button"
                          onClick={() => handleHeroChange("mockupImage", "")}
                          className="btn-danger-ghost"
                          title="Hapus gambar custom dan gunakan bawaan"
                        >
                          <Trash2 size={14} />
                          <span>Gunakan Bawaan</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MITRA / PARTNERSHIP                                                */}
      {/* ========================================================================= */}
      {section === "partnership" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 2: Mitra & Partner Perusahaan</h3>
              <p>Kelola judul running marquee dan daftar logo partner/klien terkemuka.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-full-col">
              <label className="form-label-bold">1. Judul Bagian</label>
              <input
                type="text"
                value={formData.partnership.title}
                onChange={(e) => handlePartnerMainChange("title", e.target.value)}
                placeholder="Sudah dipakai oleh perusahaan terkemuka"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label-bold mb-0">2. Daftar Logo Partner ({formData.partnership.list.length} Logo)</label>
                <button
                  type="button"
                  onClick={handleAddPartner}
                  className="btn-secondary-action btn-sm"
                >
                  <Plus size={14} />
                  <span>Tambah Partner</span>
                </button>
              </div>

              <div className="cards-editor-grid">
                {formData.partnership.list.map((item, idx) => (
                  <div key={item.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">PARTNER #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(idx)}
                        className="btn-delete-card"
                        title="Hapus Partner"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Nama Partner</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handlePartnerItemChange(idx, "name", e.target.value)}
                          placeholder="Nama Perusahaan"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div>
                        <label className="mini-label">URL Logo / Unggah Gambar</label>
                        <div className="d-flex gap-2 align-items-center">
                          {item.logoUrl ? (
                            <img 
                              src={item.logoUrl} 
                              alt={item.name} 
                              style={{ width: "40px", height: "40px", objectFit: "contain", background: "#ffffff", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                            />
                          ) : (
                            <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", borderRadius: "6px", border: "1px dashed #cbd5e1" }}>
                              <ImageIcon size={18} color="#94a3b8" />
                            </div>
                          )}

                          <input
                            type="text"
                            value={item.logoUrl}
                            onChange={(e) => handlePartnerItemChange(idx, "logoUrl", e.target.value)}
                            placeholder="https://... atau upload file"
                            className="form-input form-input-sm flex-1"
                          />

                          <label className="btn-upload-file btn-sm" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                            <Upload size={12} />
                            <span>{uploadingPartnerIdx === idx ? "..." : "Upload"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                setUploadingPartnerIdx(idx);
                                handleUploadPhoto(
                                  e.target.files[0],
                                  (url) => {
                                    handlePartnerItemChange(idx, "logoUrl", url);
                                    setUploadingPartnerIdx(null);
                                  },
                                  () => setUploadingPartnerIdx(null)
                                );
                              }}
                            />
                          </label>
                        </div>
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
      {/* TAB 3: FITUR & BENEFIT LAYANAN                                            */}
      {/* ========================================================================= */}
      {section === "features" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 3: Card Layanan & Keunggulan Utama</h3>
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
                placeholder="AyoKasbon dirancang untuk..."
                className="form-textarea"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">4. Gambar Ilustrasi Fitur (Sebelah Kanan)</label>
              <div className="cms-image-upload-box">
                <div className="d-flex align-items-center gap-3">
                  {formData.features.image ? (
                    <img 
                      src={formData.features.image} 
                      alt="Feature Illustration Preview" 
                      className="cms-img-thumb"
                      style={{ maxHeight: "80px", maxWidth: "120px", objectFit: "contain" }}
                    />
                  ) : (
                    <div className="cms-img-placeholder">
                      <ImageIcon size={24} />
                      <span>Menggunakan Gambar PNG Bawaan</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.features.image}
                      onChange={(e) => handleFeatureMainChange("image", e.target.value)}
                      placeholder="URL Gambar Ilustrasi Fitur"
                      className="form-input mb-2"
                    />

                    <div className="d-flex gap-2">
                      <label className="btn-upload-file">
                        <Upload size={14} />
                        <span>{uploadingFeatureImg ? "Mengunggah..." : "Upload File Ilustrasi"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={uploadingFeatureImg}
                          onChange={(e) => handleUploadPhoto(
                            e.target.files[0], 
                            (url) => handleFeatureMainChange("image", url), 
                            setUploadingFeatureImg
                          )}
                        />
                      </label>

                      {formData.features.image && (
                        <button
                          type="button"
                          onClick={() => handleFeatureMainChange("image", "")}
                          className="btn-danger-ghost"
                          title="Hapus gambar custom dan gunakan bawaan"
                        >
                          <Trash2 size={14} />
                          <span>Gunakan Bawaan</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-full-col">
              <label className="form-label-bold mb-3">5. Daftar Kartu Layanan (3 Kartu)</label>
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
                        <label className="mini-label">Deskripsi Kartu</label>
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => handleFeatureItemChange(idx, "desc", e.target.value)}
                          placeholder="Deskripsi singkat..."
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
      {/* TAB 4: KUTIPAN & VISI (QUOTE)                                             */}
      {/* ========================================================================= */}
      {section === "quote" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 4: Banner Kutipan & Visi (Quote)</h3>
              <p>Kelola kutipan besar inspiratif di tengah halaman beranda.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-full-col">
              <label className="form-label-bold">1. Judul Kutipan Utama</label>
              <input
                type="text"
                value={formData.quote.title}
                onChange={(e) => handleQuoteChange("title", e.target.value)}
                placeholder="Dana Darurat Bukan Utang."
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">2. Teks Narasi Kutipan</label>
              <textarea
                rows={4}
                value={formData.quote.text}
                onChange={(e) => handleQuoteChange("text", e.target.value)}
                placeholder="Hentikan siklus pinjol, turnover karyawan..."
                className="form-textarea"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: NILAI LEBIH & LINK APLIKASI (VALUE)                                */}
      {/* ========================================================================= */}
      {section === "value" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 5: Nilai Lebih yang Kami Berikan & Link Download Aplikasi</h3>
              <p>Atur header nilai lebih, link Google Play & Web App, serta 6 kartu keunggulan.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Section</label>
              <input
                type="text"
                value={formData.value.title}
                onChange={(e) => handleValueMainChange("title", e.target.value)}
                placeholder="Nilai Lebih yang Kami Berikan."
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Subjudul Section</label>
              <input
                type="text"
                value={formData.value.subtitle}
                onChange={(e) => handleValueMainChange("subtitle", e.target.value)}
                placeholder="Inovasi yang berfokus pada kemudahan..."
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">3. Link Google Play Store</label>
              <input
                type="text"
                value={formData.value.playStoreUrl}
                onChange={(e) => handleValueMainChange("playStoreUrl", e.target.value)}
                placeholder="https://play.google.com/store/apps/details?id=com.kasbon.id"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">4. Link Web App (Akses Browser)</label>
              <input
                type="text"
                value={formData.value.webAppUrl}
                onChange={(e) => handleValueMainChange("webAppUrl", e.target.value)}
                placeholder="https://app.ayokasbon.com/"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label-bold mb-0">5. Kartu Nilai Lebih ({formData.value.list.length} Kartu)</label>
                <button
                  type="button"
                  onClick={handleAddValueItem}
                  className="btn-secondary-action btn-sm"
                >
                  <Plus size={14} />
                  <span>Tambah Kartu</span>
                </button>
              </div>

              <div className="cards-editor-grid">
                {formData.value.list.map((item, idx) => (
                  <div key={item.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">KARTU #{idx + 1}</span>
                      <div className="d-flex align-items-center gap-2">
                        <select
                          value={item.iconType || "lightning"}
                          onChange={(e) => handleValueItemChange(idx, "iconType", e.target.value)}
                          className="select-icon-type"
                        >
                          <option value="lightning">Ikon: Petir (Cair Cepat)</option>
                          <option value="mobile">Ikon: Smartphone (Mudah)</option>
                          <option value="auto">Ikon: Refresh (Otomatis)</option>
                          <option value="shield">Ikon: Shield (Keamanan)</option>
                          <option value="percent">Ikon: 0% Bunga (Transparan)</option>
                          <option value="support">Ikon: Support (Bantuan)</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteValueItem(idx)}
                          className="btn-delete-card"
                          title="Hapus Kartu"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Judul Keunggulan</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleValueItemChange(idx, "title", e.target.value)}
                          placeholder="Judul Nilai"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div>
                        <label className="mini-label">Deskripsi</label>
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => handleValueItemChange(idx, "desc", e.target.value)}
                          placeholder="Penjelasan..."
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
      {/* TAB 6: PANTAU TRANSAKSI (MONITOR)                                         */}
      {/* ========================================================================= */}
      {section === "monitor" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 6: Pantau Transaksi Secara Realtime</h3>
              <p>Atur teks judul, deskripsi kartu info melayang, notifikasi melayang, serta gambar mockup dashboard.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Section</label>
              <input
                type="text"
                value={formData.monitor.title}
                onChange={(e) => handleMonitorChange("title", e.target.value)}
                placeholder="Pantau Transaksi Secara Realtime"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Subjudul Section</label>
              <input
                type="text"
                value={formData.monitor.subtitle}
                onChange={(e) => handleMonitorChange("subtitle", e.target.value)}
                placeholder="Debitur dan Kreditur Dapat Memantau Kasbon Karyawan"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">3. Judul Kartu Info Melayang</label>
              <input
                type="text"
                value={formData.monitor.infoTitle}
                onChange={(e) => handleMonitorChange("infoTitle", e.target.value)}
                placeholder="Visibilitas Penuh"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">4. Notifikasi Melayang (Judul & Subjudul)</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={formData.monitor.notifHeading}
                  onChange={(e) => handleMonitorChange("notifHeading", e.target.value)}
                  placeholder="Heading (Berhasil)"
                  className="form-input"
                />
                <input
                  type="text"
                  value={formData.monitor.notifDesc}
                  onChange={(e) => handleMonitorChange("notifDesc", e.target.value)}
                  placeholder="Subteks (Kasbon Berhasil Diterima)"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">5. Paragraf Deskripsi Kartu Info Melayang</label>
              <textarea
                rows={3}
                value={formData.monitor.infoDesc}
                onChange={(e) => handleMonitorChange("infoDesc", e.target.value)}
                placeholder="Pantau total pengajuan, status pencairan dana..."
                className="form-textarea"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">6. Foto Mockup Dashboard Transaksi</label>
              <div className="cms-image-upload-box">
                <div className="d-flex align-items-center gap-3">
                  {formData.monitor.mockupImage ? (
                    <img 
                      src={formData.monitor.mockupImage} 
                      alt="Dashboard Mockup Preview" 
                      className="cms-img-thumb"
                      style={{ maxHeight: "80px", maxWidth: "140px", objectFit: "contain" }}
                    />
                  ) : (
                    <div className="cms-img-placeholder">
                      <ImageIcon size={24} />
                      <span>Menggunakan Gambar Mockup Bawaan</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.monitor.mockupImage}
                      onChange={(e) => handleMonitorChange("mockupImage", e.target.value)}
                      placeholder="URL Gambar Mockup Dashboard"
                      className="form-input mb-2"
                    />

                    <div className="d-flex gap-2">
                      <label className="btn-upload-file">
                        <Upload size={14} />
                        <span>{uploadingMonitorMockup ? "Mengunggah..." : "Upload File Dashboard"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={uploadingMonitorMockup}
                          onChange={(e) => handleUploadPhoto(
                            e.target.files[0], 
                            (url) => handleMonitorChange("mockupImage", url), 
                            setUploadingMonitorMockup
                          )}
                        />
                      </label>

                      {formData.monitor.mockupImage && (
                        <button
                          type="button"
                          onClick={() => handleMonitorChange("mockupImage", "")}
                          className="btn-danger-ghost"
                          title="Gunakan mockup bawaan"
                        >
                          <Trash2 size={14} />
                          <span>Gunakan Bawaan</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: KEUNTUNGAN LAINNYA (OTHER BENEFITS)                                */}
      {/* ========================================================================= */}
      {section === "otherBenefits" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 7: Keuntungan Lainnya (Other Benefits)</h3>
              <p>Atur header dan kartu-kartu ekosistem lengkap manfaat AyoKasbon.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Section</label>
              <input
                type="text"
                value={formData.otherBenefits.title}
                onChange={(e) => handleOtherBenefitsMainChange("title", e.target.value)}
                placeholder="Benefit Lain Dari AyoKasbon"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Subjudul Section</label>
              <input
                type="text"
                value={formData.otherBenefits.subtitle}
                onChange={(e) => handleOtherBenefitsMainChange("subtitle", e.target.value)}
                placeholder="Lebih dari sekadar aplikasi kasbon..."
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label-bold mb-0">3. Daftar Kartu Manfaat ({formData.otherBenefits.list.length} Kartu)</label>
                <button
                  type="button"
                  onClick={handleAddBenefitItem}
                  className="btn-secondary-action btn-sm"
                >
                  <Plus size={14} />
                  <span>Tambah Kartu</span>
                </button>
              </div>

              <div className="cards-editor-grid">
                {formData.otherBenefits.list.map((item, idx) => (
                  <div key={item.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">BENEFIT #{idx + 1}</span>
                      <div className="d-flex align-items-center gap-2">
                        <select
                          value={item.iconType || "payroll"}
                          onChange={(e) => handleOtherBenefitsItemChange(idx, "iconType", e.target.value)}
                          className="select-icon-type"
                        >
                          <option value="payroll">Ikon: Payroll (Otomatis)</option>
                          <option value="ewa">Ikon: EWA (Akses Gaji)</option>
                          <option value="encryption">Ikon: Enkripsi (Keamanan)</option>
                          <option value="bills">Ikon: Tagihan (Pembayaran)</option>
                          <option value="analytics">Ikon: Analitik (HRD)</option>
                          <option value="community">Ikon: Keluarga (Proteksi)</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteBenefitItem(idx)}
                          className="btn-delete-card"
                          title="Hapus Benefit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Judul Benefit</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleOtherBenefitsItemChange(idx, "title", e.target.value)}
                          placeholder="Judul Benefit"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="mini-label">Deskripsi</label>
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => handleOtherBenefitsItemChange(idx, "desc", e.target.value)}
                          placeholder="Deskripsi..."
                          className="form-textarea form-textarea-sm"
                        />
                      </div>

                      <div className="d-flex align-items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id={`comingSoon-${idx}`}
                          checked={!!item.isComingSoon}
                          onChange={(e) => handleOtherBenefitsItemChange(idx, "isComingSoon", e.target.checked)}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor={`comingSoon-${idx}`} style={{ fontSize: "12px", cursor: "pointer", userSelect: "none", color: "#64748b" }}>
                          Tandai sebagai <strong>Coming Soon</strong>
                        </label>
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
      {/* TAB 8: TESTIMONI KARYAWAN                                                 */}
      {/* ========================================================================= */}
      {section === "testimonials" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 8: Testimoni Karyawan</h3>
              <p>Kelola judul, subjudul, dan 3 ulasan karyawan asli pengguna aplikasi.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Bagian Testimoni</label>
              <input
                type="text"
                value={formData.testimonials.title}
                onChange={(e) => handleTestimonialMainChange("title", e.target.value)}
                placeholder="Dipercaya oleh Para Karyawan"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Subjudul Bagian Testimoni</label>
              <input
                type="text"
                value={formData.testimonials.subtitle}
                onChange={(e) => handleTestimonialMainChange("subtitle", e.target.value)}
                placeholder="Pengalaman nyata dari mereka..."
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold mb-3">3. Daftar Kartu Testimoni Karyawan</label>
              <div className="cards-editor-grid">
                {formData.testimonials.list.map((item, idx) => (
                  <div key={item.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">TESTIMONI #{idx + 1}</span>
                      <div 
                        className="color-preview-circle"
                        style={{ background: item.color || "#0072FF" }}
                        title="Gradient Warna Avatar"
                      />
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Nama Karyawan</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleTestimonialItemChange(idx, "name", e.target.value)}
                          placeholder="Nama Lengkap"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="mini-label">Perusahaan / Institusi</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => handleTestimonialItemChange(idx, "company", e.target.value)}
                          placeholder="Nama Perusahaan"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="mini-label">Kutipan Ulasan / Testimoni</label>
                        <textarea
                          rows={3}
                          value={item.quote}
                          onChange={(e) => handleTestimonialItemChange(idx, "quote", e.target.value)}
                          placeholder="Komentar kepuasan..."
                          className="form-textarea form-textarea-sm"
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <div className="flex-1">
                          <label className="mini-label">Inisial Huruf</label>
                          <input
                            type="text"
                            maxLength={2}
                            value={item.initial}
                            onChange={(e) => handleTestimonialItemChange(idx, "initial", e.target.value)}
                            placeholder="A"
                            className="form-input form-input-sm text-center font-bold"
                          />
                        </div>
                        <div className="flex-2">
                          <label className="mini-label">Gradient Avatar</label>
                          <input
                            type="text"
                            value={item.color}
                            onChange={(e) => handleTestimonialItemChange(idx, "color", e.target.value)}
                            placeholder="linear-gradient(...)"
                            className="form-input form-input-sm"
                          />
                        </div>
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
      {/* TAB 9: BANNER TRIAL CTA                                                   */}
      {/* ========================================================================= */}
      {section === "cta" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 9: Banner Trial Gratis (Call To Action)</h3>
              <p>Kelola ajakan aksi uji coba gratis 30 hari di bagian bawah halaman.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Judul Banner CTA</label>
              <input
                type="text"
                value={formData.cta.title}
                onChange={(e) => handleCtaChange("title", e.target.value)}
                placeholder="Dapatkan Trial 30 Hari"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Tombol Aksi (Teks & Link Tujuan)</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={formData.cta.btnText}
                  onChange={(e) => handleCtaChange("btnText", e.target.value)}
                  placeholder="Teks Tombol (cth: Hubungi Kami)"
                  className="form-input"
                />
                <input
                  type="text"
                  value={formData.cta.btnLink}
                  onChange={(e) => handleCtaChange("btnLink", e.target.value)}
                  placeholder="Link Tujuan (cth: /hubungi-kami)"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">3. Paragraf Ajakan & Penjelasan</label>
              <textarea
                rows={3}
                value={formData.cta.desc}
                onChange={(e) => handleCtaChange("desc", e.target.value)}
                placeholder="Mulai transformasi kesejahteraan karyawan Anda hari ini..."
                className="form-textarea"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">4. Gambar Ilustrasi Banner CTA (Sisi Kanan)</label>
              <div className="cms-image-upload-box">
                <div className="d-flex align-items-center gap-3">
                  {formData.cta.image ? (
                    <img 
                      src={formData.cta.image} 
                      alt="CTA Illustration Preview" 
                      className="cms-img-thumb"
                      style={{ maxHeight: "80px", maxWidth: "120px", objectFit: "contain" }}
                    />
                  ) : (
                    <div className="cms-img-placeholder">
                      <ImageIcon size={24} />
                      <span>Menggunakan SVG Bawaan</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.cta.image}
                      onChange={(e) => handleCtaChange("image", e.target.value)}
                      placeholder="URL Gambar Ilustrasi Banner CTA"
                      className="form-input mb-2"
                    />

                    <div className="d-flex gap-2">
                      <label className="btn-upload-file">
                        <Upload size={14} />
                        <span>{uploadingCtaImg ? "Mengunggah..." : "Upload File CTA"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={uploadingCtaImg}
                          onChange={(e) => handleUploadPhoto(
                            e.target.files[0], 
                            (url) => handleCtaChange("image", url), 
                            setUploadingCtaImg
                          )}
                        />
                      </label>

                      {formData.cta.image && (
                        <button
                          type="button"
                          onClick={() => handleCtaChange("image", "")}
                          className="btn-danger-ghost"
                          title="Hapus gambar custom dan gunakan bawaan"
                        >
                          <Trash2 size={14} />
                          <span>Gunakan Bawaan</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: PANDUAN VIDEO INTERAKTIF                                          */}
      {/* ========================================================================= */}
      {section === "videoGuide" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 10: Panduan Video Interaktif</h3>
              <p>Kelola carousel video panduan YouTube beserta label nama file video.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke / (Beranda)</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-half-col">
              <label className="form-label-bold">1. Label Badge Atas</label>
              <input
                type="text"
                value={formData.videoGuide.badge}
                onChange={(e) => handleVideoMainChange("badge", e.target.value)}
                placeholder="Panduan Interaktif"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Judul Section</label>
              <input
                type="text"
                value={formData.videoGuide.title}
                onChange={(e) => handleVideoMainChange("title", e.target.value)}
                placeholder="Lebih Dekat dengan AyoKasbon"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">3. Subjudul Section</label>
              <textarea
                rows={2}
                value={formData.videoGuide.subtitle}
                onChange={(e) => handleVideoMainChange("subtitle", e.target.value)}
                placeholder="Geser untuk menjelajahi ekosistem..."
                className="form-textarea"
              />
            </div>

            <div className="form-full-col">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label-bold mb-0">4. Daftar Video Carousel ({formData.videoGuide.videos.length} Video)</label>
                <button
                  type="button"
                  onClick={handleAddVideo}
                  className="btn-secondary-action btn-sm"
                >
                  <Plus size={14} />
                  <span>Tambah Video</span>
                </button>
              </div>

              <div className="cards-editor-grid">
                {formData.videoGuide.videos.map((item, idx) => (
                  <div key={item.id || idx} className="card-editor-item">
                    <div className="card-item-header">
                      <span className="card-idx-badge">VIDEO #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(idx)}
                        className="btn-delete-card"
                        title="Hapus Video"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="card-item-fields">
                      <div className="mb-2">
                        <label className="mini-label">Label Nama File (Mac Window)</label>
                        <input
                          type="text"
                          value={item.filename}
                          onChange={(e) => handleVideoItemChange(idx, "filename", e.target.value)}
                          placeholder="cth: presentasi-v3.mp4"
                          className="form-input form-input-sm"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="mini-label">YouTube Video ID</label>
                        <input
                          type="text"
                          value={item.youtubeId}
                          onChange={(e) => {
                            let val = e.target.value.trim();
                            // Jika user mem-paste URL YouTube penuh, ekstrak video ID-nya otomatis!
                            if (val.includes("v=")) {
                              val = val.split("v=")[1].split("&")[0];
                            } else if (val.includes("youtu.be/")) {
                              val = val.split("youtu.be/")[1].split("?")[0];
                            } else if (val.includes("embed/")) {
                              val = val.split("embed/")[1].split("?")[0];
                            }
                            handleVideoItemChange(idx, "youtubeId", val);
                          }}
                          placeholder="cth: P2UQiwnUT6o atau paste link YouTube"
                          className="form-input form-input-sm"
                        />
                      </div>

                      {item.youtubeId && (
                        <div style={{ marginTop: "4px" }}>
                          <a
                            href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: "11.5px", color: "#0284c7", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <PlayCircle size={12} />
                            <span>Preview Video di YouTube</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar Save */}
      <div className="cms-bottom-save-bar">
        <div className="save-bar-info">
          <span>Perubahan disimpan langsung ke database Firestore secara aman.</span>
        </div>
        <div className="d-flex gap-2">
          <button 
            type="button" 
            onClick={handleResetDefault}
            className="btn-secondary-action btn-sm"
          >
            <RotateCcw size={14} />
            <span>Reset Bawaan</span>
          </button>

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
    </div>
  );
}
