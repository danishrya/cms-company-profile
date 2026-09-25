import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { 
  FileText, 
  PlusCircle, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Check, 
  DownloadCloud, 
  Activity, 
  Sparkles, 
  Home, 
  Info, 
  PhoneCall, 
  ArrowUpRight,
  ImageIcon,
  Inbox
} from "lucide-react";

// Safe text extractor helpers to prevent rendering Objects as React children
const getAuthorName = (author) => {
  if (!author) return "Tim Redaksi";
  if (typeof author === "object") return author.name || author.role || "Tim Redaksi";
  if (typeof author === "string") return author;
  return "Tim Redaksi";
};

const getArticleDate = (art) => {
  if (typeof art.date === "string" && art.date.trim()) return art.date;
  if (art.createdAt?.toDate) {
    try {
      return art.createdAt.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {}
  }
  return "Terbaru";
};

const getArticleTitle = (title) => {
  if (typeof title === "string" && title.trim()) return title;
  return "Artikel Tanpa Judul";
};

// 6 Artikel Sampel Resmi
const SEED_ARTICLES = [
  {
    title: "Mengenal Earned Wage Access (EWA): Solusi Finansial Fleksibel Karyawan",
    slug: "mengenal-earned-wage-access-ewa-solusi-finansial-fleksibel",
    category: "Finansial",
    author: { name: "Tim Redaksi Ayo Kasbon", role: "Redaksi" },
    date: "24 Sep 2026",
    status: "published",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    excerpt: "Bagaimana sistem kasbon modern berbasis digital membantu stabilitas keuangan pekerja tanpa membebani arus kas perusahaan.",
    content: "<p>Dalam lanskap ketenagakerjaan modern, tantangan finansial darurat sering kali menjadi beban mental terbesar bagi para karyawan.</p>"
  },
  {
    title: "5 Manfaat Memberikan Benefit Finansial Terhadap Produktivitas Tim",
    slug: "5-manfaat-memberikan-benefit-finansial-terhadap-produktivitas-tim",
    category: "HR & Bisnis",
    author: { name: "Dian Permata", role: "HR Consultant" },
    date: "20 Sep 2026",
    status: "published",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    excerpt: "Riset membuktikan stres finansial memangkas hingga 30% produktivitas harian tim di kantor. Ini jalan keluarnya.",
    content: "<p>Kesejahteraan finansial (financial wellness) kini bukan lagi sekadar bonus tambahan.</p>"
  }
];

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "articles"));
      
      let allArticles = [];
      querySnapshot.forEach((d) => {
        if (!d.id.startsWith("__page_")) {
          allArticles.push({ id: d.id, ...d.data() });
        }
      });

      const total = allArticles.length;
      const published = allArticles.filter((a) => a.status === "published").length;
      const drafts = allArticles.filter((a) => a.status === "draft").length;

      setStats({ total, published, drafts });
      setRecentArticles(allArticles.slice(0, 5));

      // Hitung pesan masuk
      try {
        const msgSnap = await getDocs(collection(db, "contact_messages"));
        const unread = msgSnap.docs.filter((d) => d.data()?.status !== "replied").length;
        setUnreadMessagesCount(unread);
      } catch {
        setUnreadMessagesCount(0);
      }
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus artikel: "${getArticleTitle(title)}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "articles", id));
      await loadDashboardData();
    } catch (err) {
      console.error("Gagal menghapus artikel:", err);
      alert("Gagal menghapus artikel. Silakan coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeedArticles = async () => {
    if (
      !window.confirm(
        "Apakah Anda ingin memasukkan artikel panduan finansial contoh ke database Firebase?"
      )
    ) {
      return;
    }

    try {
      setImporting(true);
      const colRef = collection(db, "articles");
      for (const item of SEED_ARTICLES) {
        await addDoc(colRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 4000);
      await loadDashboardData();
    } catch (err) {
      console.error("Gagal mengimpor artikel contoh:", err);
      alert("Gagal mengimpor artikel contoh: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="cms-page-container">
      {/* Top Banner & Header */}
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Dashboard Utama Website</h1>
          <p className="cms-page-subtitle">
            Ringkasan manajemen konten halaman website Ayo Kasbon dan analitik pengunjung secara terpadu.
          </p>
        </div>

        <div className="cms-header-actions">
          <Link
            to="/tracking"
            className="btn-secondary-action"
            title="Pantau trafik & data pengunjung website"
          >
            <Activity size={15} className="text-emerald" />
            <span>Track Pengunjung</span>
          </Link>
          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
            title="Lihat website utama di tab baru"
          >
            <ExternalLink size={15} />
            <span>Web Live</span>
          </a>
          <Link to="/articles/new" className="btn-primary-action">
            <PlusCircle size={16} />
            <span>Tulis Artikel</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. UNIVERSAL PAGES OVERVIEW CARDS (Home, About, Contact, Articles)        */}
      {/* ========================================================================= */}
      <div className="dashboard-pages-grid mb-4">
        {/* Page Card 1: Home */}
        <div className="page-module-card">
          <div className="module-card-header">
            <div className="module-icon-box bg-blue-subtle">
              <Home size={20} className="text-blue" />
            </div>
            <span className="badge-module-status active-green">● Aktif di Web</span>
          </div>
          <h3 className="module-title">Halaman Beranda</h3>
          <p className="module-desc">
            Banner hero utama, 10 section fitur layanan, testimoni mitra & CTA trial kasbon.
          </p>
          <div className="module-chips-list">
            <Link to="/home/hero" className="module-chip">Hero Banner</Link>
            <Link to="/home/partnership" className="module-chip">Mitra</Link>
            <Link to="/home/features" className="module-chip">Fitur</Link>
            <Link to="/home/testimonials" className="module-chip">Testimoni</Link>
            <Link to="/home/cta" className="module-chip">CTA Trial</Link>
          </div>
          <div className="module-card-footer">
            <Link to="/home" className="btn-module-action primary">
              <span>Buka Pengelola Beranda</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Page Card 2: About */}
        <div className="page-module-card">
          <div className="module-card-header">
            <div className="module-icon-box bg-amber-subtle">
              <Info size={20} className="text-amber" />
            </div>
            <span className="badge-module-status active-green">● Aktif di Web</span>
          </div>
          <h3 className="module-title">Halaman Tentang Kami</h3>
          <p className="module-desc">
            Hero profil visi perusahaan, foto sejarah tim pendiri, keunggulan, & banner CS.
          </p>
          <div className="module-chips-list">
            <Link to="/about/hero" className="module-chip">Hero Profil</Link>
            <Link to="/about/history" className="module-chip">Foto Tim</Link>
            <Link to="/about/why" className="module-chip">Keunggulan</Link>
            <Link to="/about/consultation" className="module-chip">Banner CS</Link>
          </div>
          <div className="module-card-footer">
            <Link to="/about" className="btn-module-action primary">
              <span>Buka Pengelola Tentang</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Page Card 3: Contact */}
        <div className="page-module-card">
          <div className="module-card-header">
            <div className="module-icon-box bg-purple-subtle">
              <PhoneCall size={20} className="text-purple" />
            </div>
            {unreadMessagesCount > 0 ? (
              <span className="badge-module-status badge-unread-alert">
                {unreadMessagesCount} Pesan Baru
              </span>
            ) : (
              <span className="badge-module-status active-green">● Aktif di Web</span>
            )}
          </div>
          <h3 className="module-title">Halaman Hubungi Kami</h3>
          <p className="module-desc">
            Teks ajakan kolaborasi, nomor kontak resmi WhatsApp/email CS, & kotak masuk pesan.
          </p>
          <div className="module-chips-list">
            <Link to="/contact/hero" className="module-chip">Hero Banner</Link>
            <Link to="/contact/info" className="module-chip">Info Kontak CS</Link>
            <Link to="/contact/messages" className="module-chip">
              Kotak Masuk {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
            </Link>
          </div>
          <div className="module-card-footer">
            <Link to="/contact" className="btn-module-action primary">
              <span>Buka Pengelola Kontak</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Page Card 4: Articles */}
        <div className="page-module-card">
          <div className="module-card-header">
            <div className="module-icon-box bg-emerald-subtle">
              <FileText size={20} className="text-emerald" />
            </div>
            <span className="badge-module-status active-green">{stats.published} Tayang</span>
          </div>
          <h3 className="module-title">Berita & Edukasi</h3>
          <p className="module-desc">
            Header hero edukasi, artikel panduan finansial, tips HR & pengelolaan kasbon digital.
          </p>
          <div className="module-chips-list">
            <Link to="/articles/hero" className="module-chip">Hero Header</Link>
            <Link to="/articles" className="module-chip">Semua ({stats.total})</Link>
            <Link to="/articles/new" className="module-chip">+ Tulis Baru</Link>
          </div>
          <div className="module-card-footer">
            <Link to="/articles" className="btn-module-action primary">
              <span>Kelola Semua Artikel</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PUSAT AKSI CEPAT (QUICK ACCESS SHORTCUTS)                             */}
      {/* ========================================================================= */}
      <div className="dashboard-quick-actions mb-4">
        <div className="quick-actions-header">
          <h3 className="section-title">Pusat Aksi Cepat</h3>
          <p className="section-subtitle">Pintasan praktis untuk mengakses modul yang paling sering diperbarui</p>
        </div>
        <div className="quick-actions-grid">
          <Link to="/contact/messages" className="quick-action-btn">
            <div className="qa-icon-wrap subtle-purple">
              <Inbox size={18} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Kotak Masuk Pesan {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}</span>
              <span className="qa-sub">Balas inquiry formulir via WhatsApp</span>
            </div>
          </Link>

          <Link to="/articles/hero" className="quick-action-btn">
            <div className="qa-icon-wrap subtle-blue">
              <Sparkles size={18} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Header Hero Artikel</span>
              <span className="qa-sub">Atur judul dan highlight edukasi</span>
            </div>
          </Link>

          <Link to="/about/hero" className="quick-action-btn">
            <div className="qa-icon-wrap subtle-amber">
              <Sparkles size={18} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Hero Tentang Kami</span>
              <span className="qa-sub">Kustomisasi visi & tombol CTA</span>
            </div>
          </Link>

          <Link to="/contact/info" className="quick-action-btn">
            <div className="qa-icon-wrap subtle-emerald">
              <PhoneCall size={18} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Info Kontak Resmi CS</span>
              <span className="qa-sub">Perbarui no WA & email operasional</span>
            </div>
          </Link>

          <Link to="/about/history" className="quick-action-btn">
            <div className="qa-icon-wrap subtle-slate">
              <ImageIcon size={18} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Foto Tim & Sejarah</span>
              <span className="qa-sub">Update foto kantor & teks pendiri</span>
            </div>
          </Link>

          <Link to="/articles/new" className="quick-action-btn">
            <div className="qa-icon-wrap subtle-blue">
              <PlusCircle size={18} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Tulis Artikel Baru</span>
              <span className="qa-sub">Publikasikan edukasi finansial</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MONITORING ARTIKEL TERBARU                                            */}
      {/* ========================================================================= */}
      <div className="dashboard-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="section-title">Artikel Finansial Terkini</h3>
            <p className="section-subtitle">Daftar artikel yang baru diterbitkan atau diedit</p>
          </div>
          <div className="d-flex align-center gap-2">
            <Link to="/articles/new" className="btn-secondary-action">
              <PlusCircle size={14} />
              <span>Tulis Baru</span>
            </Link>
            <Link to="/articles" className="btn-primary-action">
              <span>Semua Artikel</span>
            </Link>
          </div>
        </div>

        {importSuccess && (
          <div className="cms-toast toast-success mb-3" style={{ position: "static", transform: "none" }}>
            <Check size={18} />
            <span>Berhasil mengimpor artikel contoh ke Firestore!</span>
          </div>
        )}

        {recentArticles.length === 0 ? (
          <div className="empty-tracker-notice-box" style={{ margin: "20px 0" }}>
            <div className="notice-text">
              <strong>Belum Ada Artikel di Database</strong>
              <p>Anda dapat mengimpor artikel contoh resmi bawaan Ayo Kasbon ke database Firestore Anda sekarang.</p>
              <button
                type="button"
                onClick={handleSeedArticles}
                disabled={importing}
                className="btn-primary-action mt-2"
              >
                <DownloadCloud size={16} />
                <span>{importing ? "Mengimpor..." : "Impor Artikel Contoh Bawaan"}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="cms-table-responsive desktop-only-table">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Judul Artikel</th>
                    <th>Kategori</th>
                    <th>Penulis</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map((art) => (
                    <tr key={art.id}>
                      <td>
                        <div className="d-flex align-center gap-2">
                          <FileText size={16} className="text-blue flex-shrink-0" />
                          <span className="font-semibold text-main">{getArticleTitle(art.title)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-tag-browser">
                          {typeof art.category === "string" ? art.category : "Finansial"}
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary text-sm">
                          {getAuthorName(art.author)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status-pill ${art.status === "published" ? "replied" : "unread"}`}>
                          {art.status === "published" ? "Tayang" : "Draf"}
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary text-xs">
                          {getArticleDate(art)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-center gap-1">
                          <Link
                            to={`/articles/edit/${art.id}`}
                            className="btn-detail-pill"
                            title="Edit Artikel"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(art.id, art.title)}
                            disabled={deletingId === art.id}
                            className="btn-detail-pill text-danger"
                            title="Hapus Artikel"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (< 768px) - Clean, Uncrowded & Easy Touch */}
            <div className="mobile-articles-card-list">
              {recentArticles.map((art) => (
                <div key={art.id} className="mobile-article-card-item">
                  <div className="mobile-art-header">
                    <span className="badge-tag-browser">
                      {typeof art.category === "string" ? art.category : "Finansial"}
                    </span>
                    <span className={`badge-status-pill ${art.status === "published" ? "replied" : "unread"}`}>
                      {art.status === "published" ? "Tayang" : "Draf"}
                    </span>
                  </div>

                  <h4 className="mobile-art-title">{getArticleTitle(art.title)}</h4>
                  
                  <div className="mobile-art-meta">
                    <span>{getAuthorName(art.author)}</span>
                    <span>•</span>
                    <span>{getArticleDate(art)}</span>
                  </div>

                  <div className="mobile-art-actions">
                    <Link
                      to={`/articles/edit/${art.id}`}
                      className="btn-secondary-action w-100 justify-center"
                    >
                      <Edit size={14} />
                      <span>Edit Artikel</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(art.id, art.title)}
                      disabled={deletingId === art.id}
                      className="btn-secondary-action text-danger justify-center"
                      title="Hapus"
                      style={{ padding: "0 12px" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
