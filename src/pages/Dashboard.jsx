import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  addDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { SEED_ARTICLES } from "../data/seedArticles";
import { 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowUpRight, 
  Edit, 
  Trash2,
  DownloadCloud,
  Check,
  Home,
  Info,
  Sparkles,
  PhoneCall,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Compass
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    categories: 0,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [aboutConfigStatus, setAboutConfigStatus] = useState("Memeriksa...");
  const [homeConfigStatus, setHomeConfigStatus] = useState("Memeriksa...");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      // Load articles (filter out system page configs)
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs
        .filter((d) => !d.id.startsWith("__page_"))
        .map((d) => ({ id: d.id, ...d.data() }));

      const publishedCount = docs.filter((a) => a.status === "published").length;
      const draftCount = docs.filter((a) => a.status === "draft").length;

      // Unique categories count
      const categoriesSet = new Set(
        docs.map((a) => a.category).filter(Boolean)
      );

      setStats({
        total: docs.length,
        published: publishedCount,
        draft: draftCount,
        categories: categoriesSet.size || 6,
      });

      setRecentArticles(docs.slice(0, 5));

      // Cek apakah Tentang Kami sudah ada konfigurasi kustom di Firestore
      try {
        const aboutSnap = await getDoc(doc(db, "articles", "__page_about"));
        if (aboutSnap.exists()) {
          setAboutConfigStatus("Tersinkronisasi Kustom");
        } else {
          setAboutConfigStatus("Menggunakan Data Bawaan");
        }
      } catch {
        setAboutConfigStatus("Data Bawaan Aktif");
      }

      // Cek apakah Beranda sudah ada konfigurasi kustom di Firestore
      try {
        const homeSnap = await getDoc(doc(db, "articles", "__page_home"));
        if (homeSnap.exists()) {
          setHomeConfigStatus("Tersinkronisasi Kustom");
        } else {
          setHomeConfigStatus("Menggunakan Data Bawaan");
        }
      } catch {
        setHomeConfigStatus("Data Bawaan Aktif");
      }
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus artikel: "${title}"?`)) {
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
        "Apakah Anda ingin memasukkan 6 artikel panduan finansial contoh ke database Firebase?"
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
            Ringkasan terpadu dan akses cepat ke seluruh halaman website: Beranda, Tentang Kami, dan Berita & Artikel.
          </p>
        </div>

        <div className="cms-header-actions">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
            title="Lihat website utama"
          >
            <ExternalLink size={16} />
            <span>Kunjungi Web Live</span>
          </a>
          <Link to="/articles/new" className="btn-primary-action">
            <PlusCircle size={18} />
            <span>Tulis Artikel Baru</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. UNIVERSAL PAGES OVERVIEW CARDS (Home, About, Articles)                */}
      {/* ========================================================================= */}
      <div className="dashboard-pages-grid mb-4">
        {/* Page Card 1: Home */}
        <div className="page-module-card highlight-card">
          <div className="module-card-header">
            <div className="module-icon-box bg-blue-subtle">
              <Home size={22} className="text-blue" />
            </div>
            <span className="badge-module-status active-green">Aktif di Web</span>
          </div>
          <h3 className="module-title">Halaman Beranda</h3>
          <p className="module-desc">
            Pengaturan banner hero, kartu fitur layanan kasbon, dan testimoni mitra perusahaan.
          </p>
          <div className="module-stats-list">
            <div className="module-stat-row">
              <span className="stat-bullet blue"></span>
              <span>1 Hero & Banner Utama</span>
            </div>
            <div className="module-stat-row">
              <span className="stat-bullet blue"></span>
              <span>Kartu Keunggulan & Layanan</span>
            </div>
            <div className="module-stat-row">
              <span className="stat-bullet blue"></span>
              <span>Status: <strong>{homeConfigStatus}</strong></span>
            </div>
          </div>
          <div className="module-card-footer">
            <Link to="/home" className="btn-module-action primary">
              <span>Kelola Beranda</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Page Card 2: About (Tahap 2) */}
        <div className="page-module-card highlight-card">
          <div className="module-card-header">
            <div className="module-icon-box bg-amber-subtle">
              <Info size={22} className="text-amber" />
            </div>
            <span className="badge-module-status active-green">Aktif di Web</span>
          </div>
          <h3 className="module-title">Halaman Tentang Kami</h3>
          <p className="module-desc">
            Kelola foto tim dokumentasi, teks sejarah pendiri, kartu keunggulan, dan banner CS.
          </p>
          <div className="module-stats-list">
            <div className="module-stat-row">
              <span className="stat-bullet amber"></span>
              <span>Sejarah & Foto Dokumentasi Tim</span>
            </div>
            <div className="module-stat-row">
              <span className="stat-bullet amber"></span>
              <span>3 Kartu Kenapa Ayo Kasbon</span>
            </div>
            <div className="module-stat-row">
              <span className="stat-bullet amber"></span>
              <span>Status: <strong>{aboutConfigStatus}</strong></span>
            </div>
          </div>
          <div className="module-card-footer">
            <Link to="/about" className="btn-module-action primary">
              <span>Kelola Tentang Kami</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Page Card 3: Articles */}
        <div className="page-module-card">
          <div className="module-card-header">
            <div className="module-icon-box bg-emerald-subtle">
              <FileText size={22} className="text-emerald" />
            </div>
            <span className="badge-module-status success">Aktif di Web</span>
          </div>
          <h3 className="module-title">Berita & Edukasi</h3>
          <p className="module-desc">
            Manajemen artikel finansial, panduan EWA kasbon, tips HR, dan penautan backlink otomatis.
          </p>
          <div className="module-stats-list">
            <div className="module-stat-row">
              <span className="stat-bullet green"></span>
              <span>{stats.total} Total Artikel Terdaftar</span>
            </div>
            <div className="module-stat-row">
              <span className="stat-bullet green"></span>
              <span>{stats.published} Artikel Sedang Tayang</span>
            </div>
            <div className="module-stat-row">
              <span className="stat-bullet green"></span>
              <span>{stats.categories} Kategori Topik</span>
            </div>
          </div>
          <div className="module-card-footer">
            <Link to="/articles" className="btn-module-action">
              <span>Kelola Semua Artikel</span>
              <ArrowUpRight size={15} />
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
          <p className="section-subtitle">Akses langsung ke menu yang paling sering diedit</p>
        </div>
        <div className="quick-actions-grid">
          <Link to="/about" className="quick-action-btn">
            <div className="qa-icon-wrap amber">
              <ImageIcon size={20} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Ganti Foto Tim & Sejarah</span>
              <span className="qa-sub">Update foto kantor dan teks pendiri</span>
            </div>
          </Link>

          <Link to="/about" className="quick-action-btn">
            <div className="qa-icon-wrap blue">
              <Layers size={20} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Edit Kartu Kenapa Kasbon</span>
              <span className="qa-sub">3 pilar keunggulan layanan kasbon</span>
            </div>
          </Link>

          <Link to="/about" className="quick-action-btn">
            <div className="qa-icon-wrap purple">
              <PhoneCall size={20} />
            </div>
            <div className="qa-texts">
              <span className="qa-title">Edit Banner Konsultasi CS</span>
              <span className="qa-sub">Atur penawaran dan nomor kontak</span>
            </div>
          </Link>

          <Link to="/articles/new" className="quick-action-btn">
            <div className="qa-icon-wrap green">
              <PlusCircle size={20} />
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
            <h3 className="section-title">Daftar Artikel Terkini</h3>
            <p className="section-subtitle">Pantau dan kelola artikel yang baru saja dibuat atau diperbarui</p>
          </div>
          <div className="d-flex align-center gap-2">
            {stats.total > 0 && (
              <button 
                onClick={handleSeedArticles}
                disabled={importing}
                className="btn-seed-outline"
                title="Tambah 6 artikel bawaan contoh jika dibutuhkan"
              >
                <DownloadCloud size={14} />
                <span>+ Import Contoh</span>
              </button>
            )}
            <Link to="/articles" className="btn-view-all">
              <span>Lihat Semua Artikel ({stats.total})</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="cms-table-loading">
            <div className="cms-spinner"></div>
            <p>Memuat data artikel...</p>
          </div>
        ) : recentArticles.length === 0 ? (
          <div className="empty-state-box">
            <FileText size={48} className="empty-icon" />
            <h4>Belum Ada Artikel di Database Firestore</h4>
            <p>Anda dapat mengimpor 6 artikel panduan finansial bawaan atau membuat artikel pertama sendiri.</p>
            <div className="d-flex gap-3 mt-3 justify-center">
              <button 
                onClick={handleSeedArticles}
                disabled={importing}
                className="btn-primary-action"
              >
                <DownloadCloud size={18} />
                <span>{importing ? "Mengimpor Data..." : "📥 Import 6 Artikel Bawaan (1-Klik)"}</span>
              </button>
              <Link to="/articles/new" className="btn-secondary-action">
                <PlusCircle size={18} />
                <span>Buat Manual Sendiri</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="cms-table-responsive">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Artikel</th>
                  <th>Kategori</th>
                  <th>Penulis</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div className="table-article-meta">
                        {article.image ? (
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="table-thumb-img" 
                          />
                        ) : (
                          <div className="table-thumb-placeholder">
                            <FileText size={18} />
                          </div>
                        )}
                        <div className="table-article-text">
                          <span className="table-article-title" title={article.title}>
                            {article.title}
                          </span>
                          <span className="table-article-slug">/{article.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-badge-cat">
                        {article.category || "Umum"}
                      </span>
                    </td>
                    <td>
                      <span className="table-author-name">
                        {article.author?.name || article.authorName || "Tim Ayo Kasbon"}
                      </span>
                    </td>
                    <td>
                      <span className={"badge-status " + (article.status === "published" ? "status-published" : "status-draft")}>
                        {article.status === "published" ? "Tayang" : "Draf"}
                      </span>
                    </td>
                    <td>
                      <span className="table-date-text">
                        {article.date || "Baru"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-action-btns">
                        <Link 
                          to={`/articles/edit/${article.id}`} 
                          className="btn-action-edit"
                          title="Edit artikel"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deletingId === article.id}
                          className="btn-action-delete"
                          title="Hapus artikel"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
