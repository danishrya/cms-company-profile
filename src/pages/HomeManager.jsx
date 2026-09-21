import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Home as HomeIcon, 
  Sparkles, 
  Layers, 
  MessageSquareQuote, 
  ExternalLink,
  ImageIcon
} from "lucide-react";

export default function HomeManager() {
  const { section = "hero" } = useParams();

  const tabs = [
    { id: "hero", label: "Hero & Banner Utama", icon: HomeIcon },
    { id: "features", label: "Card Layanan & Fitur", icon: Layers },
    { id: "testimonials", label: "Testimoni & Mitra", icon: MessageSquareQuote },
  ];

  return (
    <div className="cms-page-container">
      {/* Page Header */}
      <div className="cms-page-header">
        <div>
          <div className="d-flex align-center gap-2 mb-1">
            <span className="badge-stage-pill gray">TAHAP 3 ROADMAP</span>
            <span className="text-muted text-sm">• Pengelola Halaman Beranda</span>
          </div>
          <h1 className="cms-page-title">Pengelola Halaman Beranda (Home)</h1>
          <p className="cms-page-subtitle">
            Kelola teks hero banner, foto mockup, kartu layanan & fitur, dan testimoni pengguna.
          </p>
        </div>

        <div className="cms-header-actions">
          <a
            href="http://localhost:5173/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
          >
            <ExternalLink size={16} />
            <span>Lihat Beranda Live</span>
          </a>
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

      {/* Overview / Notification Card */}
      <div className="cms-stage-notice-card">
        <div className="notice-icon-circle blue">
          <Sparkles size={24} />
        </div>
        <div className="notice-content">
          <h4>Tahap 1: Struktur Menu & Navigasi Berhasil Dibuat!</h4>
          <p>
            Menu dan submenu untuk <strong>Beranda (Home)</strong> sudah aktif di Sidebar CMS. Form input untuk pengaturan Hero Banner, 
            Card Fitur, dan Testimoni akan dikerjakan pada <strong>Tahap 3</strong> setelah Tahap 2 selesai.
          </p>
        </div>
      </div>

      {/* Preview Section based on active tab */}
      {section === "hero" && (
        <div className="cms-preview-card">
          <div className="preview-card-header">
            <div>
              <h3>Modul 1: Hero & Banner Utama Beranda</h3>
              <p>Pengaturan headline utama, deskripsi penawaran, tombol CTA, dan foto mockup aplikasi.</p>
            </div>
            <span className="badge-roadmap">Dijadwalkan di Tahap 3</span>
          </div>

          <div className="preview-fields-grid">
            <div className="preview-field-box">
              <label>Headline Utama (H1)</label>
              <div className="field-wireframe-input">Solusi Finansial Karyawan Terdepan & Terpercaya</div>
            </div>
            <div className="preview-field-box">
              <label>Sub-headline / Deskripsi</label>
              <div className="field-wireframe-textarea">Tingkatkan produktivitas kerja dengan akses kasbon digital tanpa bunga dan tanpa riba...</div>
            </div>
          </div>
        </div>
      )}

      {section === "features" && (
        <div className="cms-preview-card">
          <div className="preview-card-header">
            <div>
              <h3>Modul 2: Card Layanan & Fitur Utama</h3>
              <p>Kelola kartu manfaat kasbon bagi perusahaan dan karyawan.</p>
            </div>
            <span className="badge-roadmap">Dijadwalkan di Tahap 3</span>
          </div>

          <div className="preview-cards-list">
            <div className="preview-mini-card">
              <div className="card-number">Card #1</div>
              <h4>Akses Gaji Lebih Fleksibel</h4>
              <p>Karyawan dapat mencairkan sebagian gaji yang telah dihasilkan kapan saja dibutuhkan.</p>
            </div>
            <div className="preview-mini-card">
              <div className="card-number">Card #2</div>
              <h4>Tanpa Beban Hutang</h4>
              <p>Bukan pinjaman online berbunga tinggi, melainkan hak gaji karyawan sendiri.</p>
            </div>
          </div>
        </div>
      )}

      {section === "testimonials" && (
        <div className="cms-preview-card">
          <div className="preview-card-header">
            <div>
              <h3>Modul 3: Testimoni & Mitra Perusahaan</h3>
              <p>Kelola ulasan klien, mitra integrasi, dan logo partner terverifikasi.</p>
            </div>
            <span className="badge-roadmap">Dijadwalkan di Tahap 3</span>
          </div>

          <div className="preview-fields-grid">
            <div className="preview-field-box">
              <label>Testimoni HR & Karyawan</label>
              <div className="field-wireframe-input">Daftar ulasan dari berbagai perusahaan mitra...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
