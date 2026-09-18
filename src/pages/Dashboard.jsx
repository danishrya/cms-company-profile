import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { SEED_ARTICLES } from "../data/seedArticles";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Layers, 
  PlusCircle, 
  ArrowUpRight,
  TrendingUp,
  Edit,
  DownloadCloud,
  Check,
  Trash2
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    categories: 6,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "articles", id));
      await loadDashboardData();
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus artikel: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };


  async function loadDashboardData() {
    try {
      setLoading(true);
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      const publishedCount = docs.filter(a => a.status === "published").length;
      const draftCount = docs.filter(a => a.status === "draft").length;

      setStats({
        total: docs.length,
        published: publishedCount,
        draft: draftCount,
        categories: 6
      });

      setRecentArticles(docs.slice(0, 5));
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // One-click seed function
  const handleSeedArticles = async () => {
    if (!window.confirm("Apakah Anda ingin memasukkan 6 artikel panduan finansial & EWA awal ke database Firestore?")) {
      return;
    }

    try {
      setImporting(true);
      const colRef = collection(db, "articles");
      for (const item of SEED_ARTICLES) {
        await addDoc(colRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 4000);
      await loadDashboardData();
    } catch (err) {
      console.error("Gagal import:", err);
      alert("Gagal import artikel: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="cms-page-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-col">
          <div className="welcome-badge">
            <TrendingUp size={14} />
            <span>Dashboard Edukasi &amp; Berita Ayo Kasbon</span>
          </div>
          <h1 className="welcome-title">Kelola Publikasi Artikel Secara Mandiri</h1>
          <p className="welcome-desc">
            Buat artikel inspiratif untuk seluruh generasi karyawan (Gen Z, Milenial, Gen X) dan manajemen HR dengan kemudahan terhubung ke Firebase Firestore.
          </p>
        </div>
        <div className="welcome-action-col d-flex gap-2">
          {stats.total === 0 && (
            <button 
              onClick={handleSeedArticles}
              disabled={importing}
              className="btn-secondary-action"
              title="Masukkan 6 artikel bawaan ke Firebase"
            >
              {importing ? (
                <div className="cms-spinner-sm" />
              ) : importSuccess ? (
                <Check size={18} className="text-success" />
              ) : (
                <DownloadCloud size={18} />
              )}
              <span>{importing ? "Mengimpor..." : importSuccess ? "Berhasil Diimpor!" : "Sinkronkan 6 Artikel Awal"}</span>
            </button>
          )}

          <Link to="/articles/new" className="btn-primary-action">
            <PlusCircle size={18} />
            <span>Tulis Artikel Baru</span>
          </Link>
        </div>
      </div>

      {/* Stat Metric Cards */}
      <div className="stats-metric-grid">
        <div className="stat-card">
          <div className="stat-icon-box bg-blue-light">
            <FileText size={24} className="text-blue" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Artikel</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box bg-emerald-light">
            <CheckCircle2 size={24} className="text-emerald" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Artikel Tayang</span>
            <span className="stat-value">{stats.published}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box bg-amber-light">
            <Clock size={24} className="text-amber" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Draf Belum Tayang</span>
            <span className="stat-value">{stats.draft}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box bg-indigo-light">
            <Layers size={24} className="text-indigo" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Kategori Topik</span>
            <span className="stat-value">{stats.categories}</span>
          </div>
        </div>
      </div>

      {/* Recent Articles Table Section */}
      <div className="dashboard-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="section-title">Artikel Terbaru</h3>
            <p className="section-subtitle">Daftar artikel yang baru saja ditambahkan atau diperbarui</p>
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
              <span>Lihat Semua Artikel</span>
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
