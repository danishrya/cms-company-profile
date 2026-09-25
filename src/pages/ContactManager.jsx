import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { 
  PhoneCall, 
  Mail, 
  Clock, 
  Video, 
  MessageSquare, 
  MessageSquareQuote,
  Sparkles, 
  Save, 
  RotateCcw, 
  Upload, 
  Link2, 
  Trash2, 
  ExternalLink,
  CheckCircle2, 
  AlertCircle,
  Inbox,
  User,
  Building2,
  Calendar,
  Search,
  Filter,
  CheckCheck,
  Send,
  Eye,
  Check
} from "lucide-react";

// Default Data Resmi Hubungi Kami Ayo Kasbon
const DEFAULT_CONTACT_DATA = {
  hero: {
    title: "Mari Berkolaborasi Dengan Kami",
    description: "Kami selalu siap memberi yang terbaik untuk Anda. Hubungi kami untuk konsultasi seputar platform AYO KASBON, integrasi sistem payroll kantor, maupun kerja sama kemitraan. Tim Ayo Kasbon siap mendampingi Anda menghadirkan solusi finansial yang aman, transparan, dan terpercaya.",
    image: "" // Kosong = pakai aset lokal contact-hero.png
  },
  info: {
    title: "Kehadiran Yang Bisa Diandalkan",
    phone: "0819-1945-5792",
    email: "cs@ayokasbon.com",
    operatingHours: "Monday - Friday: 09.30 – 18.00",
    youtubeUrl: "https://www.youtube.com/watch?v=Afv0GhVjeho",
    youtubeLabel: "Ayo Kasbon",
    whatsappDirect: "https://wa.me/6281919455792",
    address: "Jakarta, Indonesia"
  },
  formNotice: {
    heading: "Kirimkan Pesan Anda",
    subheading: "Punya pertanyaan seputar Ayo Kasbon atau ingin menjadwalkan demo? Tim kami siap membantu Anda.",
    securityNote: "Data privasi Anda terjamin aman dan tidak akan dibagikan ke pihak ketiga."
  }
};

const SAMPLE_MESSAGES = [
  {
    id: "msg_sample_1",
    name: "Budi Santoso",
    email: "budi.santoso@perusahaan-abc.co.id",
    phone: "081234567890",
    company: "PT Maju Bersama Logistik",
    message: "Halo tim Ayo Kasbon, kami tertarik mengintegrasikan sistem kasbon digital untuk sekitar 450 staf operasional kami. Bisakah dijadwalkan demo sistem minggu depan?",
    createdAtFormatted: "25 Sep 2026, 10:15 WIB",
    status: "unread"
  },
  {
    id: "msg_sample_2",
    name: "Ratna Sari Dewi",
    email: "ratna.sd@nusantara-retail.com",
    phone: "081987654321",
    company: "CV Retail Nusantara",
    message: "Selamat pagi, kami ingin berkonsultasi mengenai skema kemitraan kasbon tanpa riba dan kepatuhan syariahnya untuk karyawan toko cabang kami.",
    createdAtFormatted: "24 Sep 2026, 14:30 WIB",
    status: "replied"
  }
];

export default function ContactManager() {
  const { section = "hero" } = useParams();

  const [formData, setFormData] = useState(DEFAULT_CONTACT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Upload state
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false);

  // State Pesan Masuk (Inbox)
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [messageFilterStatus, setMessageFilterStatus] = useState("all");

  const tabs = [
    { id: "hero", label: "1. Hero & Kolaborasi", icon: Sparkles },
    { id: "info", label: "2. Info Kontak Resmi", icon: PhoneCall },
    { id: "messages", label: "3. Kotak Masuk Pesan", icon: MessageSquareQuote },
  ];

  // 1. Muat Konfigurasi Konten Halaman dari Firestore
  useEffect(() => {
    async function loadContactData() {
      try {
        setLoading(true);
        let snap = await getDoc(doc(db, "articles", "__page_contact"));
        if (!snap.exists()) {
          try {
            snap = await getDoc(doc(db, "site_content", "contact"));
          } catch {}
        }

        if (snap.exists()) {
          const remoteData = snap.data();
          setFormData({
            hero: { ...DEFAULT_CONTACT_DATA.hero, ...remoteData.hero },
            info: { ...DEFAULT_CONTACT_DATA.info, ...remoteData.info },
            formNotice: { ...DEFAULT_CONTACT_DATA.formNotice, ...remoteData.formNotice }
          });
        }
      } catch (err) {
        console.error("Gagal memuat data kontak:", err);
      } finally {
        setLoading(false);
      }
    }

    loadContactData();
  }, []);

  // 2. Real-time Listener Pesan Masuk (Inbox) dari Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const colRef = collection(db, "contact_messages");
      unsubscribe = onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            let dateStr = "Hari ini";
            if (data.createdAt?.toDate) {
              dateStr = data.createdAt.toDate().toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }) + " WIB";
            } else if (data.createdAtFormatted) {
              dateStr = data.createdAtFormatted;
            }
            return {
              id: docSnap.id,
              ...data,
              createdAtFormatted: dateStr
            };
          });
          setMessages(list);
        } else {
          setMessages(SAMPLE_MESSAGES);
        }
      }, () => {
        setMessages(SAMPLE_MESSAGES);
      });
    } catch {
      setMessages(SAMPLE_MESSAGES);
    }

    return () => unsubscribe();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4500);
  };

  // Upload Foto Hero ke Firebase Storage
  const handleUploadHeroPhoto = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (PNG, JPG, JPEG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }

    try {
      setUploadingHeroImg(true);
      const storageRef = ref(storage, `site_content/contact/hero_${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (err) => {
          console.error("Upload error:", err);
          alert("Gagal mengunggah foto: " + err.message);
          setUploadingHeroImg(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            hero: { ...prev.hero, image: downloadUrl }
          }));
          setUploadingHeroImg(false);
          showToast("Foto Hero Kontak berhasil diunggah!");
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert("Terjadi kesalahan upload: " + err.message);
      setUploadingHeroImg(false);
    }
  };

  // Simpan Data Konten ke Firestore
  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        lastUpdated: serverTimestamp()
      };

      await setDoc(doc(db, "articles", "__page_contact"), payload, { merge: true });

      try {
        await setDoc(doc(db, "site_content", "contact"), payload, { merge: true });
      } catch {}

      showToast("Data Halaman Hubungi Kami berhasil disimpan ke Firebase!");
    } catch (err) {
      console.error("Gagal menyimpan data kontak:", err);
      alert("Gagal menyimpan data: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reset ke data awal bawaan resmi
  const handleResetDefault = () => {
    if (window.confirm("Kembalikan konten halaman Hubungi Kami ke pengaturan default resmi Ayo Kasbon?")) {
      setFormData(DEFAULT_CONTACT_DATA);
      showToast("Formulir telah direset ke nilai default.");
    }
  };

  // Tandai Pesan Selesai Dihubungi / Belum
  const handleToggleMessageStatus = async (msg) => {
    const nextStatus = msg.status === "replied" ? "unread" : "replied";
    try {
      await updateDoc(doc(db, "contact_messages", msg.id), { status: nextStatus });
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
      );
    }
    showToast(nextStatus === "replied" ? "Pesan ditandai Sudah Dihubungi." : "Pesan ditandai Belum Dibaca.");
  };

  // Hapus Pesan Masuk
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Hapus pesan ini dari kotak masuk?")) return;
    try {
      await deleteDoc(doc(db, "contact_messages", msgId));
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    }
    if (selectedMessage?.id === msgId) {
      setSelectedMessage(null);
    }
    showToast("Pesan berhasil dihapus dari kotak masuk.");
  };

  // Filter list pesan
  const filteredMessages = messages.filter((m) => {
    const matchStatus = 
      messageFilterStatus === "all" || 
      (messageFilterStatus === "unread" && m.status !== "replied") ||
      (messageFilterStatus === "replied" && m.status === "replied");

    const query = messageSearchQuery.toLowerCase().trim();
    const matchQuery = 
      !query ||
      m.name?.toLowerCase().includes(query) ||
      m.company?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query) ||
      m.message?.toLowerCase().includes(query);

    return matchStatus && matchQuery;
  });

  const unreadCount = messages.filter((m) => m.status !== "replied").length;

  if (loading) {
    return (
      <div className="cms-page-container">
        <div className="cms-loading-state">
          <div className="cms-spinner" />
          <p>Memuat Konfigurasi Halaman Hubungi Kami...</p>
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
          <h1 className="cms-page-title">Pengelola Halaman Hubungi Kami</h1>
          <p className="cms-page-subtitle">
            Kelola teks hero ajakan kolaborasi, nomor kontak resmi, link media sosial, serta pantau pesan masuk dari formulir website.
          </p>
        </div>

        <div className="cms-header-actions">
          <a
            href="http://localhost:5175/hubungi-kami"
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
              to={`/contact/${tab.id}`}
              className={`cms-tab-btn ${isActive ? "active" : ""}`}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
              {tab.id === "messages" && unreadCount > 0 && (
                <span className="badge-unread-count">{unreadCount}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* TAB 1: HERO & KOLABORASI */}
      {section === "hero" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 1: Hero Banner & Teks Ajakan Kolaborasi</h3>
              <p>Kelola headline utama, deskripsi penawaran, dan foto visual tim yang tampil di bagian atas halaman Hubungi Kami.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke /hubungi-kami</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-full-col">
              <label className="form-label-bold">1. Judul Utama Hero</label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                placeholder="Mari Berkolaborasi Dengan Kami"
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">2. Deskripsi Ajakan Kolaborasi</label>
              <textarea
                rows={4}
                value={formData.hero.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
                placeholder="Tuliskan deskripsi penawaran kolaborasi..."
                className="form-textarea"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">3. Foto Visual Tim / Banner Kolaborasi</label>
              <div className="photo-editor-wrapper">
                <div className="photo-preview-box">
                  {formData.hero.image ? (
                    <img src={formData.hero.image} alt="Preview Foto Hero" className="preview-img-square" />
                  ) : (
                    <div className="default-photo-placeholder">
                      <Sparkles size={28} className="text-blue" />
                      <span>Menggunakan Foto Visual Bawaan (contact-hero.png)</span>
                    </div>
                  )}

                  {formData.hero.image && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, image: "" } }))}
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
                      id="hero-contact-photo-input"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUploadHeroPhoto(e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="hero-contact-photo-input" className="btn-upload-file">
                      <Upload size={16} />
                      <span>{uploadingHeroImg ? "Mengunggah..." : "Upload Gambar Hero Baru"}</span>
                    </label>
                  </div>

                  <div className="divider-or">
                    <span>atau masukkan URL gambar eksternal</span>
                  </div>

                  <div className="input-with-icon">
                    <Link2 size={16} className="input-icon" />
                    <input
                      type="url"
                      placeholder="https://contoh.com/foto-tim.png"
                      value={formData.hero.image}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hero: { ...prev.hero, image: e.target.value } }))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INFORMASI KONTAK RESMI & SOSIAL MEDIA */}
      {section === "info" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 2: Informasi Kontak Resmi & Saluran Komunikasi</h3>
              <p>Kelola nomor telepon WhatsApp CS, alamat email resmi, jam operasional, dan tautan video edukasi Ayo Kasbon.</p>
            </div>
            <span className="badge-live-tag">Terkoneksi ke Kartu Kiri Halaman</span>
          </div>

          <div className="form-grid-layout">
            <div className="form-full-col">
              <label className="form-label-bold">1. Judul Kartu Kontak</label>
              <input
                type="text"
                value={formData.info.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, info: { ...prev.info, title: e.target.value } }))}
                placeholder="Kehadiran Yang Bisa Diandalkan"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">2. Nomor Telepon / WhatsApp CS</label>
              <input
                type="text"
                value={formData.info.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, info: { ...prev.info, phone: e.target.value } }))}
                placeholder="0819-1945-5792"
                className="form-input"
              />
              <span className="form-hint-text">Ditampilkan pada baris telepon dan tombol hubungi.</span>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">3. Alamat Email Resmi</label>
              <input
                type="email"
                value={formData.info.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, info: { ...prev.info, email: e.target.value } }))}
                placeholder="cs@ayokasbon.com"
                className="form-input"
              />
              <span className="form-hint-text">Alamat tujuan untuk pertanyaan kerja sama & payroll.</span>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">4. Jam Operasional Layanan</label>
              <input
                type="text"
                value={formData.info.operatingHours}
                onChange={(e) => setFormData((prev) => ({ ...prev, info: { ...prev.info, operatingHours: e.target.value } }))}
                placeholder="Monday - Friday: 09.30 – 18.00"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">5. Tautan YouTube / Video Pengenalan</label>
              <input
                type="url"
                value={formData.info.youtubeUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, info: { ...prev.info, youtubeUrl: e.target.value } }))}
                placeholder="https://www.youtube.com/watch?v=Afv0GhVjeho"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">6. Link Langsung WhatsApp (wa.me)</label>
              <input
                type="url"
                value={formData.info.whatsappDirect}
                onChange={(e) => setFormData((prev) => ({ ...prev, info: { ...prev.info, whatsappDirect: e.target.value } }))}
                placeholder="https://wa.me/6281919455792"
                className="form-input"
              />
              <span className="form-hint-text">Digunakan untuk integrasi tombol floating WhatsApp.</span>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">7. Kota / Alamat Kantor Pusat</label>
              <input
                type="text"
                value={formData.info.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, info: { ...prev.info, address: e.target.value } }))}
                placeholder="Jakarta, Indonesia"
                className="form-input"
              />
            </div>

            {/* Pengaturan Teks Formulir */}
            <div className="form-full-col mt-4">
              <h4 className="sub-heading-border" style={{ fontSize: "15px", fontWeight: 700, margin: "10px 0", color: "#1e293b", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                Pengaturan Teks Formulir Pesan
              </h4>
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">Judul Formulir</label>
              <input
                type="text"
                value={formData.formNotice.heading}
                onChange={(e) => setFormData((prev) => ({ ...prev, formNotice: { ...prev.formNotice, heading: e.target.value } }))}
                placeholder="Kirimkan Pesan Anda"
                className="form-input"
              />
            </div>

            <div className="form-half-col">
              <label className="form-label-bold">Catatan Keamanan Data</label>
              <input
                type="text"
                value={formData.formNotice.securityNote}
                onChange={(e) => setFormData((prev) => ({ ...prev, formNotice: { ...prev.formNotice, securityNote: e.target.value } }))}
                placeholder="Data privasi Anda terjamin aman..."
                className="form-input"
              />
            </div>

            <div className="form-full-col">
              <label className="form-label-bold">Subjudul Formulir</label>
              <textarea
                rows={2}
                value={formData.formNotice.subheading}
                onChange={(e) => setFormData((prev) => ({ ...prev, formNotice: { ...prev.formNotice, subheading: e.target.value } }))}
                placeholder="Punya pertanyaan seputar Ayo Kasbon..."
                className="form-textarea"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KOTAK MASUK PESAN PENGUNJUNG (INBOX LEADS) */}
      {section === "messages" && (
        <div className="cms-editor-card">
          <div className="editor-card-header">
            <div>
              <h3>Modul 3: Kotak Masuk Pesan Pengunjung (Lead Inquiries)</h3>
              <p>Daftar pertanyaan dan pengajuan jadwal demo yang dikirimkan pengunjung dari formulir website secara real-time.</p>
            </div>
            <div className="d-flex align-center gap-2">
              <span className="badge-live-tag">
                <span className="live-dot-pulse" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#10b981", marginRight: 6 }} />
                Real-time Inbox
              </span>
            </div>
          </div>

          {/* Toolbar Pencarian & Filter */}
          <div className="d-flex align-center justify-between gap-3 mb-4" style={{ flexWrap: "wrap" }}>
            <div className="analytics-search-box" style={{ flex: 1, minWidth: "260px" }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Cari nama, perusahaan, email, atau isi pesan..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="analytics-search-input"
              />
            </div>

            <div className="d-flex align-center gap-2">
              <button
                type="button"
                onClick={() => setMessageFilterStatus("all")}
                className={`cms-tab-btn ${messageFilterStatus === "all" ? "active" : ""}`}
                style={{ padding: "6px 12px", fontSize: "13px" }}
              >
                Semua ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setMessageFilterStatus("unread")}
                className={`cms-tab-btn ${messageFilterStatus === "unread" ? "active" : ""}`}
                style={{ padding: "6px 12px", fontSize: "13px" }}
              >
                Belum Dibaca ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setMessageFilterStatus("replied")}
                className={`cms-tab-btn ${messageFilterStatus === "replied" ? "active" : ""}`}
                style={{ padding: "6px 12px", fontSize: "13px" }}
              >
                Sudah Dihubungi ({messages.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Tabel Pesan Masuk */}
          {filteredMessages.length === 0 ? (
            <div className="empty-tracker-notice-box" style={{ margin: "20px 0", textAlign: "center" }}>
              <Inbox size={42} className="text-muted" style={{ margin: "0 auto 8px" }} />
              <h4>Tidak Ada Pesan Ditemukan</h4>
              <p>Belum ada pesan yang sesuai dengan filter pencarian saat ini.</p>
            </div>
          ) : (
            <div className="cms-table-responsive">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Pengirim</th>
                    <th>Perusahaan</th>
                    <th>Kontak WhatsApp / Email</th>
                    <th>Isi Pesan</th>
                    <th>Waktu Masuk</th>
                    <th>Status</th>
                    <th>Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => {
                    const isUnread = msg.status !== "replied";
                    const cleanPhone = (msg.phone || "").replace(/[^0-9]/g, "");
                    const waLink = cleanPhone.startsWith("0") 
                      ? `https://wa.me/62${cleanPhone.slice(1)}` 
                      : `https://wa.me/${cleanPhone}`;
                    const mailtoLink = `mailto:${msg.email}?subject=Tindak Lanjut Konsultasi Ayo Kasbon - ${encodeURIComponent(msg.name || "")}`;

                    return (
                      <tr key={msg.id} style={{ background: isUnread ? "#f0fdf4" : "transparent" }}>
                        <td>
                          <div className="d-flex align-center gap-2">
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                              {(msg.name || "U")[0].toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-main" style={{ display: "block" }}>{msg.name}</span>
                              {isUnread && <span style={{ fontSize: 10, background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>BARU</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="font-medium text-secondary">{msg.company || "-"}</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span className="text-sm font-semibold">{msg.phone}</span>
                            <span className="text-xs text-muted">{msg.email}</span>
                          </div>
                        </td>
                        <td style={{ maxWidth: "260px" }}>
                          <p style={{ margin: 0, fontSize: 13, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={msg.message}>
                            {msg.message}
                          </p>
                        </td>
                        <td>
                          <span className="text-xs text-secondary">{msg.createdAtFormatted}</span>
                        </td>
                        <td>
                          {isUnread ? (
                            <span style={{ fontSize: 11, background: "#fee2e2", color: "#b91c1c", padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
                              Belum Dibaca
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: 12, fontWeight: 700 }}>
                              Sudah Dihubungi
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex align-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedMessage(msg)}
                              className="btn-detail-pill"
                              style={{ padding: "4px 8px" }}
                              title="Baca Lengkap"
                            >
                              <Eye size={14} />
                            </button>

                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-detail-pill"
                              style={{ padding: "4px 8px", background: "#dcfce7", color: "#15803d" }}
                              title="Balas WhatsApp"
                            >
                              <Send size={14} />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleToggleMessageStatus(msg)}
                              className="btn-detail-pill"
                              style={{ padding: "4px 8px" }}
                              title={isUnread ? "Tandai Sudah Dihubungi" : "Tandai Belum Dibaca"}
                            >
                              <CheckCheck size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="btn-detail-pill text-danger"
                              style={{ padding: "4px 8px", color: "#dc2626" }}
                              title="Hapus Pesan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL DETAIL BACA PESAN */}
      {selectedMessage && (
        <div className="analytics-modal-backdrop" onClick={() => setSelectedMessage(null)}>
          <div className="analytics-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "620px" }}>
            <div className="modal-header">
              <div className="d-flex align-center gap-2">
                <MessageSquare size={22} className="text-blue" />
                <div>
                  <h3 className="modal-title">Pesan Masuk dari {selectedMessage.name}</h3>
                  <span className="modal-subtitle">{selectedMessage.company} • {selectedMessage.createdAtFormatted}</span>
                </div>
              </div>

              <button onClick={() => setSelectedMessage(null)} className="modal-btn-close">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: 12, color: "#64748b", display: "block" }}>Email Pengirim:</span>
                  <a href={`mailto:${selectedMessage.email}`} style={{ fontWeight: 600, color: "#2563eb", textDecoration: "underline", fontSize: 13 }}>
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: "#64748b", display: "block" }}>Nomor WhatsApp / Telp:</span>
                  <a 
                    href={`https://wa.me/${(selectedMessage.phone || "").replace(/[^0-9]/g, "")}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ fontWeight: 600, color: "#059669", textDecoration: "underline", fontSize: 13 }}
                  >
                    {selectedMessage.phone}
                  </a>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "block", marginBottom: "6px" }}>
                  Isi Pesan / Kebutuhan Solusi:
                </span>
                <div style={{ padding: "14px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: 14, lineHeight: "1.6", color: "#334155", whiteSpace: "pre-wrap" }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div className="d-flex align-center justify-between" style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleMessageStatus(selectedMessage);
                    setSelectedMessage((prev) => ({
                      ...prev,
                      status: prev.status === "replied" ? "unread" : "replied"
                    }));
                  }}
                  className="btn-secondary-action"
                >
                  <CheckCheck size={16} />
                  <span>{selectedMessage.status === "replied" ? "Tandai Belum Dibaca" : "Tandai Sudah Dihubungi"}</span>
                </button>

                <div className="d-flex align-center gap-2">
                  <a
                    href={`https://wa.me/${(selectedMessage.phone || "").replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary-action"
                    style={{ background: "#059669" }}
                  >
                    <Send size={15} />
                    <span>Balas via WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Tindak Lanjut Ayo Kasbon - ${encodeURIComponent(selectedMessage.name || "")}`}
                    className="btn-secondary-action"
                  >
                    <Mail size={15} />
                    <span>Balas via Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Quick Save */}
      {section !== "messages" && (
        <div className="cms-bottom-save-bar">
          <div className="save-bar-info">
            <span>Pastikan untuk menyimpan perubahan setelah mengedit formulir Hubungi Kami.</span>
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
      )}
    </div>
  );
}
