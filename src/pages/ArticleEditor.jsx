import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";

const CATEGORIES = [
  { id: "ewa", name: "Solusi EWA & Kasbon", color: "teal" },
  { id: "pinjol", name: "Bahaya Pinjol & Paylater", color: "red" },
  { id: "finansial", name: "Tips & Literasi Finansial", color: "emerald" },
  { id: "keluarga", name: "Keuangan Keluarga", color: "purple" },
  { id: "hr", name: "Kesejahteraan HR", color: "orange" },
  { id: "keamanan", name: "Regulasi & Keamanan Data", color: "blue" },
];

export default function ArticleEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Solusi EWA & Kasbon",
    categoryId: "ewa",
    badgeColor: "teal",
    excerpt: "",
    readTime: "4 min baca",
    authorName: "Tim Edukasi Ayo Kasbon",
    authorRole: "Financial Literacy Specialists",
    image: "",
    status: "published",
    isFeatured: false,
    intro: "",
    takeaways: ["", ""],
    bodyParagraphs: ["", ""],
    quote: "",
    sourceName: "",
    sourceUrl: "",
  });

  // Load article if editing
  useEffect(() => {
    if (!isEditing) return;
    async function fetchArticle() {
      try {
        const docRef = doc(db, "articles", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const d = snapshot.data();
          setFormData({
            title: d.title || "",
            slug: d.slug || "",
            category: d.category || "Solusi EWA & Kasbon",
            categoryId: d.categoryId || "ewa",
            badgeColor: d.badgeColor || "teal",
            excerpt: d.excerpt || "",
            readTime: d.readTime || "4 min baca",
            authorName: d.author?.name || d.authorName || "Tim Edukasi Ayo Kasbon",
            authorRole: d.author?.role || d.authorRole || "Financial Specialists",
            image: d.image || "",
            status: d.status || "published",
            isFeatured: Boolean(d.isFeatured),
            intro: d.content?.intro || d.intro || "",
            takeaways: d.content?.takeaways || d.takeaways || [""],
            bodyParagraphs: d.content?.body || d.bodyParagraphs || [""],
            quote: d.content?.quote || d.quote || "",
            sourceName: d.sourceName || d.source?.name || "",
            sourceUrl: d.sourceUrl || d.source?.url || "",
          });
        } else {
          alert("Artikel tidak ditemukan!");
          navigate("/articles");
        }
      } catch (err) {
        console.error("Gagal load artikel:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, isEditing, navigate]);

  // Auto generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setFormData(prev => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : generatedSlug
    }));
  };

  const handleCategoryChange = (e) => {
    const catName = e.target.value;
    const found = CATEGORIES.find(c => c.name === catName) || CATEGORIES[0];
    setFormData(prev => ({
      ...prev,
      category: found.name,
      categoryId: found.id,
      badgeColor: found.color
    }));
  };

  // Helper Kompres Gambar Otomatis (Tanpa Firebase Storage / 100% Free)
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Format WebP ringan (fallback ke JPEG)
          let dataUrl = canvas.toDataURL("image/webp", 0.75);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          }
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Upload & Kompres Gambar Langsung
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran berkas terlalu besar. Maksimal 10MB.");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress(50);
      const compressedDataUrl = await compressImage(file);
      setUploadProgress(100);
      setFormData(prev => ({ ...prev, image: compressedDataUrl }));
      setUploadingImage(false);
      setUploadProgress(0);
      showToast("Foto berhasil dioptimasi & siap dipublikasikan!");
    } catch (err) {
      console.error("Gagal kompresi gambar:", err);
      alert("Gagal memproses gambar: " + err.message);
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Dynamic Takeaways
  const handleTakeawayChange = (index, value) => {
    const updated = [...formData.takeaways];
    updated[index] = value;
    setFormData(prev => ({ ...prev, takeaways: updated }));
  };

  const addTakeaway = () => {
    setFormData(prev => ({ ...prev, takeaways: [...prev.takeaways, ""] }));
  };

  const removeTakeaway = (index) => {
    setFormData(prev => ({
      ...prev,
      takeaways: prev.takeaways.filter((_, i) => i !== index)
    }));
  };

  // Dynamic Body Paragraphs
  const handleBodyChange = (index, value) => {
    const updated = [...formData.bodyParagraphs];
    updated[index] = value;
    setFormData(prev => ({ ...prev, bodyParagraphs: updated }));
  };

  const addBodyParagraph = () => {
    setFormData(prev => ({ ...prev, bodyParagraphs: [...prev.bodyParagraphs, ""] }));
  };

  const removeBodyParagraph = (index) => {
    setFormData(prev => ({
      ...prev,
      bodyParagraphs: prev.bodyParagraphs.filter((_, i) => i !== index)
    }));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus artikel "${formData.title}" ini?`)) {
      return;
    }
    try {
      setSaving(true);
      await deleteDoc(doc(db, "articles", id));
      alert("Artikel berhasil dihapus!");
      navigate("/articles");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus: " + err.message);
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Judul artikel wajib diisi!");
      return;
    }

    try {
      setSaving(true);
      const articlePayload = {
        title: formData.title,
        slug: formData.slug || "artikel-" + Date.now(),
        category: formData.category,
        categoryId: formData.categoryId,
        badgeColor: formData.badgeColor,
        excerpt: formData.excerpt,
        readTime: formData.readTime,
        image: formData.image,
        status: formData.status,
        isFeatured: formData.isFeatured,
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        author: {
          name: formData.authorName,
          role: formData.authorRole,
        },
        content: {
          intro: formData.intro,
          takeaways: formData.takeaways.filter(t => t.trim() !== ""),
          body: formData.bodyParagraphs.filter(b => b.trim() !== ""),
          quote: formData.quote,
        },
        sourceName: (formData.sourceName || "").trim(),
        sourceUrl: (formData.sourceUrl || "").trim(),
        source: {
          name: (formData.sourceName || "").trim(),
          url: (formData.sourceUrl || "").trim(),
        },
        updatedAt: serverTimestamp(),
      };

      if (isEditing) {
        await updateDoc(doc(db, "articles", id), articlePayload);
        showToast("Artikel berhasil diperbarui!");
      } else {
        articlePayload.createdAt = serverTimestamp();
        await addDoc(collection(db, "articles"), articlePayload);
        showToast("Artikel baru berhasil diterbitkan!");
      }

      setTimeout(() => {
        navigate("/articles");
      }, 1200);
    } catch (err) {
      console.error("Gagal menyimpan artikel:", err);
      alert("Gagal menyimpan artikel: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="cms-page-container">
        <div className="cms-table-loading">
          <div className="cms-spinner"></div>
          <p>Memuat data editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-page-container">
      {toastMessage && (
        <div className="cms-toast">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editor Top Bar */}
      <div className="page-header-flex">
        <div className="d-flex align-center gap-3">
          <Link to="/articles" className="btn-back">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="cms-page-heading">
              {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h1>
            <p className="cms-page-subheading">
              Isi data artikel dengan lengkap agar tampil memikat di web company profile
            </p>
          </div>
        </div>

        <div className="d-flex gap-2 align-center">
          {isEditing && (
            <button 
              type="button" 
              onClick={handleDeleteArticle}
              disabled={saving}
              className="btn-danger-outline"
              title="Hapus artikel ini"
            >
              <Trash2 size={16} />
              <span>Hapus Artikel</span>
            </button>
          )}
          <button 
            type="button" 
            onClick={() => navigate("/articles")}
            className="btn-secondary"
          >
            Batal
          </button>
          <button 
            type="submit" 
            form="article-form"
            disabled={saving}
            className="btn-primary-action"
          >
            <Save size={18} />
            <span>{saving ? "Menyimpan..." : isEditing ? "Perbarui Artikel" : "Publikasikan Sekarang"}</span>
          </button>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit} className="editor-form-layout">
        {/* Kolom Kiri: Konten Utama */}
        <div className="editor-main-col">
          <div className="form-card">
            <h3 className="form-card-title">1. Informasi Utama</h3>

            <div className="form-group">
              <label className="form-label">Judul Artikel *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Mengenal Aplikasi EWA (Earned Wage Access): Cara Kerja &amp; Keunggulan"
                value={formData.title}
                onChange={handleTitleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug URL (Alamat Internal Web Ayo Kasbon)</label>
              <input
                type="text"
                placeholder="mengenal-aplikasi-ewa-cara-kerja"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="form-input text-muted"
              />
              <span className="form-hint">URL artikel di web kamu nantinya: /berita-artikel/{formData.slug || "slug-artikel"}</span>
            </div>

            {/* Sumber Asli / Backlink Referensi */}
            <div className="form-group" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 16px" }}>
              <div className="d-flex align-center justify-between mb-1">
                <label className="form-label mb-0" style={{ fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ExternalLink size={16} color="#2399ff" />
                  <span>Sumber Asli / Referensi Berita (Opsional)</span>
                </label>
                <span style={{ fontSize: "11px", padding: "2px 8px", background: "#e0f2fe", color: "#0284c7", borderRadius: "12px", fontWeight: 600 }}>
                  Backlink Rujukan
                </span>
              </div>
              <p className="form-hint" style={{ marginTop: "4px", marginBottom: "12px" }}>
                Isi kolom ini jika artikel Anda mengutip atau merujuk dari media luar (misal: Tech in Asia, Kompas, Katadata). Tautan akan tampil rapi di detail artikel website company profile.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>Nama Media / Penerbit</label>
                  <input
                    type="text"
                    placeholder="Contoh: Tech in Asia"
                    value={formData.sourceName}
                    onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>URL Link Asli (Diawali https://)</label>
                  <input
                    type="url"
                    placeholder="https://id.techinasia.com/judul-artikel-asli"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ringkasan Singkat (Excerpt) *</label>
              <textarea
                rows={3}
                required
                placeholder="Ringkasan 1-2 kalimat yang menarik minat pembaca di kartu artikel..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="form-card">
            <h3 className="form-card-title">2. Isi Artikel &amp; Edukasi EWA</h3>

            <div className="form-group">
              <label className="form-label">Paragraf Pembuka (Intro)</label>
              <textarea
                rows={3}
                placeholder="Pengantar artikel sebelum poin-poin utama..."
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                className="form-textarea"
              />
            </div>

            {/* Takeaways List */}
            <div className="form-group">
              <div className="d-flex justify-between align-center mb-2">
                <label className="form-label mb-0">Poin Kunci untuk Karyawan (Takeaways)</label>
                <button type="button" onClick={addTakeaway} className="btn-add-item">
                  <Plus size={14} />
                  <span>Tambah Poin</span>
                </button>
              </div>
              <div className="dynamic-list-box">
                {formData.takeaways.map((takeaway, idx) => (
                  <div key={idx} className="dynamic-item-row">
                    <span className="item-num">{idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Poin penting atau keunggulan EWA..."
                      value={takeaway}
                      onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                      className="form-input"
                    />
                    {formData.takeaways.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeTakeaway(idx)}
                        className="btn-remove-item"
                        title="Hapus baris"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Body Paragraphs */}
            <div className="form-group">
              <div className="d-flex justify-between align-center mb-2">
                <label className="form-label mb-0">Paragraf Penjelasan Lengkap (Body)</label>
                <button type="button" onClick={addBodyParagraph} className="btn-add-item">
                  <Plus size={14} />
                  <span>Tambah Paragraf</span>
                </button>
              </div>
              <div className="dynamic-list-box">
                {formData.bodyParagraphs.map((para, idx) => (
                  <div key={idx} className="dynamic-item-row align-start">
                    <span className="item-num mt-2">P{idx + 1}</span>
                    <textarea
                      rows={4}
                      placeholder={`Tulis paragraf ke-${idx + 1} di sini...`}
                      value={para}
                      onChange={(e) => handleBodyChange(idx, e.target.value)}
                      className="form-textarea"
                    />
                    {formData.bodyParagraphs.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeBodyParagraph(idx)}
                        className="btn-remove-item mt-2"
                        title="Hapus paragraf"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Kutipan Inspiratif / Highlight Quote</label>
              <input
                type="text"
                placeholder="Contoh: EWA bukan pinjol dan bukan utang, melainkan hak gaji Anda sendiri."
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan & Cover Image */}
        <div className="editor-side-col">
          {/* Status & Publikasi */}
          <div className="form-card">
            <h3 className="form-card-title">Status Publikasi</h3>

            <div className="form-group">
              <label className="form-label">Status Artikel</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                <option value="published">Tayang Sekarang (Published)</option>
                <option value="draft">Simpan sebagai Draf (Draft)</option>
              </select>
            </div>

            <div className="form-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="form-checkbox"
                />
                <span>Jadikan Artikel Pilihan Utama (Featured)</span>
              </label>
            </div>
          </div>

          {/* Kategori & Metadata */}
          <div className="form-card">
            <h3 className="form-card-title">Kategori &amp; Penulis</h3>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="form-select"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estimasi Waktu Baca</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="4 min baca"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nama Penulis</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="Ayu Pratiwi"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jabatan / Role Penulis</label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                placeholder="Certified Financial Planner"
                className="form-input"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="form-card">
            <h3 className="form-card-title">Gambar Cover Artikel</h3>

            <div className="image-upload-box">
              {formData.image ? (
                <div className="image-preview-wrapper">
                  <img src={formData.image} alt="Preview Cover" className="image-preview" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="btn-remove-cover"
                  >
                    Hapus Gambar
                  </button>
                </div>
              ) : (
                <div className="upload-dropzone">
                  <ImageIcon size={36} className="text-muted mb-2" />
                  <p className="upload-text">Upload foto cover artikel</p>
                  <span className="upload-subtext">PNG, JPG, WEBP hingga 5MB</span>
                  <label className="btn-file-picker">
                    <Upload size={16} />
                    <span>Pilih Berkas Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              )}

              {uploadingImage && (
                <div className="upload-progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  <span className="progress-text">Mengunggah ke Firebase... {uploadProgress}%</span>
                </div>
              )}
            </div>

            <div className="form-group mt-3">
              <label className="form-label">Atau Masukkan URL Gambar</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
