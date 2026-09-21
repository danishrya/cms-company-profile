import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Building2, 
  Image as ImageIcon, 
  Layers, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AboutManager() {
  const { section = "history" } = useParams();

  const tabs = [
    { id: "history", label: "Sejarah & Foto Tim", icon: ImageIcon },
    { id: "why", label: "Kenapa Ayo Kasbon (Cards)", icon: Layers },
    { id: "consultation", label: "Banner Konsultasi CS", icon: PhoneCall },
  ];

  return (
    <div className="cms-page-container">
      {/* Page Header */}
      <div className="cms-page-header">
        <div>
          <div className="d-flex align-center gap-2 mb-1">
            <span className="badge-stage-pill amber">TAHAP 2 ROADMAP</span>
            <span className="text-muted text-sm">• Pengelola Halaman Tentang Kami</span>
          </div>
          <h1 className="cms-page-title">Pengelola Halaman Tentang Kami (About)</h1>
          <p className="cms-page-subtitle">
            Kelola foto dokumentasi tim/kantor, teks sejarah pendiri, kartu keunggulan, dan banner kontak konsultasi.
          </p>
        </div>

        <div className="cms-header-actions">
          <a
            href="http://localhost:5173/tentang-kami"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
          >
            <ExternalLink size={16} />
            <span>Lihat Halaman Live</span>
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
              to={`/about/${tab.id}`}
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
        <div className="notice-icon-circle amber">
          <Sparkles size={24} />
        </div>
        <div className="notice-content">
          <h4>Tahap 1: Struktur Menu & Navigasi Berhasil Dibuat!</h4>
          <p>
            Menu dan submenu untuk <strong>Tentang Kami</strong> sudah aktif di Sidebar. Form input untuk upload foto tim, 
            edit teks sejarah pendiri, dan konfigurasi kartu keunggulan siap diimplementasikan secara penuh pada <strong>Tahap 2</strong>.
          </p>
        </div>
      </div>

      {/* Preview Section based on active tab */}
      {section === "history" && (
        <div className="cms-preview-card">
          <div className="preview-card-header">
            <div>
              <h3>Modul 1: Sejarah & Foto Dokumentasi Tim</h3>
              <p>Pengaturan foto dokumentasi kantor/pendiri dan narasi sejarah pendirian perusahaan.</p>
            </div>
            <span className="badge-ready">Siap Di-Coding di Tahap 2</span>
          </div>

          <div className="preview-fields-grid">
            <div className="preview-field-box">
              <label>1. Foto Dokumentasi Tim / Kantor</label>
              <div className="field-wireframe-photo">
                <ImageIcon size={32} />
                <span>Foto tim beresolusi tinggi (team-history.png)</span>
                <span className="wireframe-tag">Akan mendukung Upload File & Live Preview</span>
              </div>
            </div>

            <div className="preview-field-box">
              <label>2. Badge Tahun & Info Singkat</label>
              <div className="field-wireframe-input">
                <strong>Didirikan:</strong> Agustus 2023 oleh Ari Gunawan & Tona Mahfirohman
              </div>

              <label className="mt-3">3. Narasi Sejarah Lengkap</label>
              <div className="field-wireframe-textarea">
                Didirikan pada Agustus 2023 oleh Ari Gunawan dan Tona Mahfirohman, AYO Kasbon didukung oleh tim berpengalaman di teknologi dan keuangan. Dengan visi bersama, kami berkomitmen untuk menjadikan AYO Kasbon solusi finansial terdepan...
              </div>
            </div>
          </div>
        </div>
      )}

      {section === "why" && (
        <div className="cms-preview-card">
          <div className="preview-card-header">
            <div>
              <h3>Modul 2: Kartu Keunggulan (Kenapa Harus Ayo Kasbon?)</h3>
              <p>Kelola 3 pilar keunggulan utama layanan kasbon.</p>
            </div>
            <span className="badge-ready">Siap Di-Coding di Tahap 2</span>
          </div>

          <div className="preview-cards-list">
            <div className="preview-mini-card">
              <div className="card-number">Card #1</div>
              <h4>Tanpa Bunga</h4>
              <p>Ayo Kasbon bukan merupakan Pinjaman, karyawan hanya dikenakan Biaya Admin</p>
            </div>
            <div className="preview-mini-card">
              <div className="card-number">Card #2</div>
              <h4>Tanpa Riba</h4>
              <p>Ayo Kasbon beroperasi sesuai dengan Prinsip Syariah dan Regulasi yang Berlaku</p>
            </div>
            <div className="preview-mini-card">
              <div className="card-number">Card #3</div>
              <h4>Pencairan Cepat</h4>
              <p>Dana kasbon langsung cair ke rekening dalam hitungan menit secara instan</p>
            </div>
          </div>
        </div>
      )}

      {section === "consultation" && (
        <div className="cms-preview-card">
          <div className="preview-card-header">
            <div>
              <h3>Modul 3: Banner Konsultasi & CS</h3>
              <p>Kelola banner CTA ajakan konsultasi gratis dan demonstrasi produk.</p>
            </div>
            <span className="badge-ready">Siap Di-Coding di Tahap 2</span>
          </div>

          <div className="preview-fields-grid">
            <div className="preview-field-box">
              <label>Judul Banner</label>
              <div className="field-wireframe-input">Konsultasi Gratis dan Demo Aplikasi</div>
            </div>
            <div className="preview-field-box">
              <label>Subjudul Banner</label>
              <div className="field-wireframe-input">Daftar Segera untuk Konsultasi</div>
            </div>
            <div className="preview-field-box">
              <label>Foto / Ilustrasi CS</label>
              <div className="field-wireframe-photo small">
                <ImageIcon size={24} />
                <span>Foto CS / Banner Konsultasi</span>
              </div>
            </div>
            <div className="preview-field-box">
              <label>Tujuan Tombol CTA</label>
              <div className="field-wireframe-input">/hubungi-kami (WhatsApp / Form Kontak)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
