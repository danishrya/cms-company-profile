import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../firebase";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  FileText, 
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export const CATEGORY_OPTIONS = [
  "Semua Kategori",
  "Solusi EWA & Kasbon",
  "Bahaya Pinjol & Paylater",
  "Tips & Literasi Finansial",
  "Keuangan Keluarga",
  "Kesejahteraan HR",
  "Regulasi & Keamanan Data",
];

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Semua Kategori");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const loadArticles = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setArticles(docs);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "articles", id));
      setArticles(articles.filter(a => a.id !== id));
      showToast("Artikel berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus artikel: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filtered = articles.filter(item => {
    const matchSearch = 
      !search || 
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchCat = 
      selectedCat === "Semua Kategori" || 
      item.category === selectedCat;
    const matchStatus = 
      selectedStatus === "all" || 
      item.status === selectedStatus;

    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="cms-page-container">
      {toastMessage && (
        <div className="cms-toast">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="cms-page-heading">Kelola Artikel &amp; Berita</h1>
          <p className="cms-page-subheading">
            Daftar seluruh artikel yang tersimpan di Firebase Firestore untuk company profile
          </p>
        </div>
        <Link to="/articles/new" className="btn-primary-action">
          <PlusCircle size={18} />
          <span>Tambah Artikel</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="table-filter-bar">
        <div className="search-box-cms">
          <Search size={18} className="search-icon-cms" />
          <input
            type="text"
            placeholder="Cari judul artikel atau topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-search-cms"
          />
        </div>

        <div className="filter-select-group">
          <select 
            value={selectedCat} 
            onChange={(e) => setSelectedCat(e.target.value)}
            className="select-filter-cms"
          >
            {CATEGORY_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select-filter-cms"
          >
            <option value="all">Semua Status</option>
            <option value="published">Tayang (Published)</option>
            <option value="draft">Draf (Draft)</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="dashboard-section-card">
        {loading ? (
          <div className="cms-table-loading">
            <div className="cms-spinner"></div>
            <p>Memuat daftar artikel...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-box">
            <FileText size={48} className="empty-icon" />
            <h4>Tidak Ada Artikel yang Cocok</h4>
            <p>Coba sesuaikan kata kunci pencarian atau filter yang dipilih.</p>
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
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-article-meta">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="table-thumb-img" 
                          />
                        ) : (
                          <div className="table-thumb-placeholder">
                            <FileText size={18} />
                          </div>
                        )}
                        <div className="table-article-text">
                          <span className="table-article-title" title={item.title}>
                            {item.title}
                          </span>
                          <span className="table-article-slug">/{item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-badge-cat">
                        {item.category || "Umum"}
                      </span>
                    </td>
                    <td>
                      <span className="table-author-name">
                        {item.author?.name || item.authorName || "Tim Ayo Kasbon"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${item.status === "published" ? "status-published" : "status-draft"}`}>
                        {item.status === "published" ? "Tayang" : "Draf"}
                      </span>
                    </td>
                    <td>
                      <span className="table-date-text">
                        {item.date || "Baru"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-action-btns">
                        <Link 
                          to={`/articles/edit/${item.id}`} 
                          className="btn-action-edit"
                          title="Edit artikel"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deletingId === item.id}
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
