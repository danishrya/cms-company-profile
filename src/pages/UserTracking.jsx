import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { 
  FileText, 
  Layers, 
  MousePointerClick, 
  Eye, 
  TrendingUp, 
  Clock, 
  Smartphone, 
  Monitor, 
  Tablet, 
  ArrowUpRight, 
  ArrowDown,
  Calendar, 
  BarChart3, 
  Sparkles,
  Download, 
  RefreshCw, 
  Search, 
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  Info,
  Globe,
  Share2
} from "lucide-react";

// =========================================================================
// DATA AWAL (BASELINE BENCHMARK) UNTUK 3 PILAR PELACAKAN
// =========================================================================

// 1. Data Track Halaman
const BASE_PAGES_DATA = [
  {
    id: "page_home",
    name: "Beranda Utama (Home)",
    path: "/",
    views: 1420,
    uniqueVisitors: 980,
    avgDuration: "3m 15s",
    bounceRate: "28.4%",
    share: 45,
    topDevice: "Mobile (68%)",
    topSource: "Google Search (48%)",
    liveUrl: "http://localhost:5173/"
  },
  {
    id: "page_about",
    name: "Tentang Kami (About)",
    path: "/tentang-kami",
    views: 780,
    uniqueVisitors: 540,
    avgDuration: "2m 40s",
    bounceRate: "32.1%",
    share: 25,
    topDevice: "Desktop (52%)",
    topSource: "Direct (42%)",
    liveUrl: "http://localhost:5173/tentang-kami"
  },
  {
    id: "page_articles",
    name: "Katalog Berita & Edukasi",
    path: "/berita-artikel",
    views: 520,
    uniqueVisitors: 390,
    avgDuration: "4m 10s",
    bounceRate: "24.5%",
    share: 17,
    topDevice: "Mobile (74%)",
    topSource: "Media Sosial (38%)",
    liveUrl: "http://localhost:5173/berita-artikel"
  },
  {
    id: "page_contact",
    name: "Hubungi Kami (Konsultasi CS)",
    path: "/hubungi-kami",
    views: 290,
    uniqueVisitors: 230,
    avgDuration: "1m 50s",
    bounceRate: "18.2%",
    share: 9,
    topDevice: "Mobile (62%)",
    topSource: "Google & WA (55%)",
    liveUrl: "http://localhost:5173/hubungi-kami"
  },
  {
    id: "page_art_detail",
    name: "Artikel: Keuntungan Kasbon Karyawan & Efisiensi HR",
    path: "/berita-artikel/keuntungan-kasbon-karyawan-efisiensi-perusahaan",
    views: 130,
    uniqueVisitors: 95,
    avgDuration: "4m 45s",
    bounceRate: "20.0%",
    share: 4,
    topDevice: "Mobile (80%)",
    topSource: "LinkedIn Share (60%)",
    liveUrl: "http://localhost:5173/berita-artikel"
  }
];

// 2. Data Track Section (Scroll Depth 0% - 100%)
const BASE_SECTIONS_DATA = {
  "/": {
    pageName: "Beranda Utama (Home)",
    avgScrollDepth: "71.4%",
    totalVisits: 1420,
    sections: [
      {
        id: "sec_hero",
        name: "Navbar & Hero Banner Utama",
        positionPct: "0% - 20%",
        threshold: 0,
        reachedCount: 1420,
        reachedPct: 100,
        dropOffRate: "14%",
        description: "Bagian paling atas website, terlihat saat pertama kali dimuat",
        status: "100% Terpapar"
      },
      {
        id: "sec_features",
        name: "Section Fitur & Keunggulan Layanan Kasbon",
        positionPct: "~35%",
        threshold: 30,
        reachedCount: 1220,
        reachedPct: 86,
        dropOffRate: "19%",
        description: "User scroll minimal 30% untuk melihat kartu fitur kasbon digital",
        status: "Sangat Populer"
      },
      {
        id: "sec_testimonials",
        name: "Section Testimoni Mitra & Karyawan",
        positionPct: "~65%",
        threshold: 60,
        reachedCount: 950,
        reachedPct: 67,
        dropOffRate: "17%",
        description: "User scroll hingga 60% untuk membaca bukti kepuasan pelanggan",
        status: "Optimal"
      },
      {
        id: "sec_cta",
        name: "Section Banner Ajukan Demo / Trial",
        positionPct: "~85%",
        threshold: 80,
        reachedCount: 710,
        reachedPct: 50,
        dropOffRate: "16%",
        description: "User scroll 80% ke bawah mendekati akhir halaman",
        status: "Konversi Tinggi"
      },
      {
        id: "sec_footer",
        name: "Footer Navigasi & Regulasi Resmi (BI / Komdigi)",
        positionPct: "100%",
        threshold: 95,
        reachedCount: 480,
        reachedPct: 34,
        dropOffRate: "-",
        description: "User membaca sampai tuntas ke paling bawah halaman",
        status: "Tuntas Dibaca"
      }
    ]
  },
  "/tentang-kami": {
    pageName: "Tentang Kami (About)",
    avgScrollDepth: "66.2%",
    totalVisits: 780,
    sections: [
      {
        id: "sec_about_hero",
        name: "Hero Profil Perusahaan & Visi",
        positionPct: "0% - 20%",
        threshold: 0,
        reachedCount: 780,
        reachedPct: 100,
        dropOffRate: "16%",
        description: "Header profil dan ringkasan visi Ayo Kasbon",
        status: "100% Terpapar"
      },
      {
        id: "sec_about_history",
        name: "Sejarah & Dokumentasi Foto Tim",
        positionPct: "~40%",
        threshold: 35,
        reachedCount: 655,
        reachedPct: 84,
        dropOffRate: "21%",
        description: "Bagian cerita pendiri dan foto dokumentasi kantor",
        status: "Sangat Populer"
      },
      {
        id: "sec_about_why",
        name: "Kartu 3 Pilar Keunggulan Kasbon",
        positionPct: "~70%",
        threshold: 65,
        reachedCount: 490,
        reachedPct: 63,
        dropOffRate: "13%",
        description: "Penjelasan detail kenapa perusahaan memilih Ayo Kasbon",
        status: "Optimal"
      },
      {
        id: "sec_about_cs",
        name: "Banner Konsultasi WhatsApp CS",
        positionPct: "~90%",
        threshold: 85,
        reachedCount: 390,
        reachedPct: 50,
        dropOffRate: "17%",
        description: "Penawaran konsultasi langsung ke customer service",
        status: "Konversi Tinggi"
      },
      {
        id: "sec_about_footer",
        name: "Footer Navigasi & Kontak Legal",
        positionPct: "100%",
        threshold: 95,
        reachedCount: 260,
        reachedPct: 33,
        dropOffRate: "-",
        description: "Bagian paling bawah halaman Tentang Kami",
        status: "Tuntas Dibaca"
      }
    ]
  },
  "/berita-artikel": {
    pageName: "Katalog Berita & Edukasi",
    avgScrollDepth: "62.8%",
    totalVisits: 520,
    sections: [
      {
        id: "sec_news_header",
        name: "Header Topik & Filter Kategori",
        positionPct: "0% - 25%",
        threshold: 0,
        reachedCount: 520,
        reachedPct: 100,
        dropOffRate: "17%",
        description: "Pilihan kategori artikel finansial dan pencarian",
        status: "100% Terpapar"
      },
      {
        id: "sec_news_featured",
        name: "Artikel Utama Terpilih (Featured Post)",
        positionPct: "~45%",
        threshold: 40,
        reachedCount: 430,
        reachedPct: 83,
        dropOffRate: "21%",
        description: "Highlight artikel edukasi paling populer",
        status: "Sangat Populer"
      },
      {
        id: "sec_news_grid",
        name: "Grid Daftar Semua Artikel",
        positionPct: "~75%",
        threshold: 70,
        reachedCount: 320,
        reachedPct: 62,
        dropOffRate: "25%",
        description: "Katalog lengkap kartu artikel kasbon",
        status: "Optimal"
      },
      {
        id: "sec_news_footer",
        name: "Footer & Newsletter Finansial",
        positionPct: "100%",
        threshold: 95,
        reachedCount: 190,
        reachedPct: 37,
        dropOffRate: "-",
        description: "Bagian paling bawah halaman berita",
        status: "Tuntas Dibaca"
      }
    ]
  }
};

// 3. Data Track Button (Click Events & CTA Conversion)
const BASE_BUTTONS_DATA = [
  {
    id: "btn_hero_trial",
    name: "Coba Sekarang / Daftar",
    pageLocation: "Beranda - Hero Banner Atas",
    actionType: "Link ke /hubungi-kami",
    totalClicks: 284,
    uniqueClickers: 242,
    ctr: "20.0%",
    performance: "Sangat Tinggi",
    colorBadge: "emerald"
  },
  {
    id: "btn_cs_whatsapp",
    name: "Konsultasi WhatsApp CS",
    pageLocation: "Tentang Kami & Floating Button WA",
    actionType: "Buka Chat WhatsApp Resmi",
    totalClicks: 192,
    uniqueClickers: 175,
    ctr: "24.6%",
    performance: "Sangat Tinggi",
    colorBadge: "emerald"
  },
  {
    id: "btn_header_contact",
    name: "Hubungi Kami (Navbar Atas)",
    pageLocation: "Semua Halaman - Header Sticky",
    actionType: "Navigasi Kontak",
    totalClicks: 145,
    uniqueClickers: 120,
    ctr: "10.2%",
    performance: "Optimal",
    colorBadge: "blue"
  },
  {
    id: "btn_cta_demo",
    name: "Ajukan Demo Perusahaan",
    pageLocation: "Beranda - Section Bawah (Trial)",
    actionType: "Buka Form Demo",
    totalClicks: 118,
    uniqueClickers: 104,
    ctr: "16.6%",
    performance: "Optimal",
    colorBadge: "blue"
  },
  {
    id: "btn_read_more_article",
    name: "Baca Artikel Selengkapnya",
    pageLocation: "Berita & Edukasi - Card Post",
    actionType: "Buka Halaman Detail Artikel",
    totalClicks: 88,
    uniqueClickers: 72,
    ctr: "16.9%",
    performance: "Cukup",
    colorBadge: "amber"
  }
];

export default function UserTracking() {
  const location = useLocation();
  const { submenu } = useParams();

  // Tentukan mode aktif berdasarkan URL: overview, pages, sections, buttons
  const activeMode = useMemo(() => {
    if (submenu === "pages" || location.pathname === "/tracking/pages") return "pages";
    if (submenu === "sections" || location.pathname === "/tracking/sections") return "sections";
    if (submenu === "buttons" || location.pathname === "/tracking/buttons") return "buttons";
    return "overview";
  }, [submenu, location.pathname]);

  const [timeRange, setTimeRange] = useState("7d");
  const [selectedSectionPage, setSelectedSectionPage] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const multiplier = useMemo(() => {
    if (timeRange === "today") return 0.25;
    if (timeRange === "7d") return 1.0;
    if (timeRange === "30d") return 3.8;
    return 11.5;
  }, [timeRange]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const summary = useMemo(() => {
    const totalViews = Math.round(3140 * multiplier);
    const totalClicks = Math.round(827 * multiplier);
    const avgScroll = "69.8%";
    return { totalViews, totalClicks, avgScroll };
  }, [multiplier]);

  const pagesList = useMemo(() => {
    return BASE_PAGES_DATA.map((p) => ({
      ...p,
      views: Math.round(p.views * multiplier),
      uniqueVisitors: Math.round(p.uniqueVisitors * multiplier),
    })).filter((p) => 
      !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [multiplier, searchQuery]);

  const currentSectionData = useMemo(() => {
    const data = BASE_SECTIONS_DATA[selectedSectionPage] || BASE_SECTIONS_DATA["/"];
    return {
      ...data,
      totalVisits: Math.round(data.totalVisits * multiplier),
      sections: data.sections.map((s) => ({
        ...s,
        reachedCount: Math.round(s.reachedCount * multiplier),
      })),
    };
  }, [selectedSectionPage, multiplier]);

  const buttonsList = useMemo(() => {
    return BASE_BUTTONS_DATA.map((b) => ({
      ...b,
      totalClicks: Math.round(b.totalClicks * multiplier),
      uniqueClickers: Math.round(b.uniqueClickers * multiplier),
    })).filter((b) => 
      !searchQuery.trim() || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.pageLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [multiplier, searchQuery]);

  // Simulasi Event
  const handleSimulateEvent = (type) => {
    if (type === "page") {
      showToast("🚀 Simulasi: Kunjungan halaman baru berhasil ditambahkan!");
    } else if (type === "scroll") {
      showToast("📜 Simulasi: Pengunjung melakukan scroll hingga 85% (Section CTA Demo tercapai)!");
    } else if (type === "button") {
      showToast("🔘 Simulasi: Tombol 'Coba Sekarang / Daftar' berhasil diklik (+1 Click Event)!");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let filename = "ayo_kasbon_";
    let rows = [];
    let headers = [];

    if (activeMode === "pages") {
      filename += "track_halaman.csv";
      headers = ["Halaman", "Path", "Views", "Unique_Users", "Rata_Waktu", "Bounce_Rate", "Porsi_Trafik", "Perangkat_Utama"];
      rows = pagesList.map((p) => [
        `"${p.name}"`, p.path, p.views, p.uniqueVisitors, p.avgDuration, p.bounceRate, p.share + "%", p.topDevice
      ]);
    } else if (activeMode === "sections") {
      filename += "track_section_scroll.csv";
      headers = ["Halaman", "Section", "Posisi_Scroll", "User_Mencapai_Count", "User_Mencapai_Pct", "Drop_Off", "Status"];
      rows = currentSectionData.sections.map((s) => [
        `"${currentSectionData.pageName}"`, `"${s.name}"`, s.positionPct, s.reachedCount, s.reachedPct + "%", s.dropOffRate, s.status
      ]);
    } else {
      filename += "track_button_clicks.csv";
      headers = ["Nama_Tombol", "Lokasi", "Aksi", "Total_Klik", "Unique_Clickers", "CTR", "Performa"];
      rows = buttonsList.map((b) => [
        `"${b.name}"`, `"${b.pageLocation}"`, `"${b.actionType}"`, b.totalClicks, b.uniqueClickers, b.ctr, b.performance
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📥 Laporan ${filename} berhasil didownload!`);
  };

  return (
    <div className="cms-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="analytics-live-toast" role="alert">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">
            {activeMode === "pages" && "1. Pelacakan Halaman (Page Tracking)"}
            {activeMode === "sections" && "2. Pelacakan Section & Scroll Depth"}
            {activeMode === "buttons" && "3. Pelacakan Klik Tombol (Button Tracking)"}
            {activeMode === "overview" && "Ringkasan Pelacakan Pengunjung & Trafik"}
          </h1>
          <p className="cms-page-subtitle">
            {activeMode === "pages" && "Detail lengkap jumlah tayangan, durasi baca, pengunjung unik, dan rasio pentalan di setiap URL halaman."}
            {activeMode === "sections" && "Analisis jangkauan scroll pengguna dari 0% (Hero atas) hingga 100% (Footer) dengan logika ambang batas threshold."}
            {activeMode === "buttons" && "Mendeteksi setiap klik pada tombol WhatsApp, ajukan demo, pendaftaran kasbon, dan tombol aksi lainnya."}
            {activeMode === "overview" && "Pantau 3 pilar analitik terpadu: akses halaman, kedalaman scroll tiap section (0% - 100%), dan klik tombol CTA."}
          </p>
        </div>

        <div className="cms-header-actions">
          <button
            onClick={() => handleSimulateEvent(activeMode === "buttons" ? "button" : activeMode === "sections" ? "scroll" : "page")}
            className="btn-secondary-action"
            title="Kirim simulasi data interaksi"
          >
            <Sparkles size={16} className="text-amber" />
            <span>+ Simulasi {activeMode === "buttons" ? "Klik Tombol" : activeMode === "sections" ? "Scroll Section" : "Kunjungan"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-secondary-action"
            title="Download laporan tabel ke CSV"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => showToast("🔄 Data analitik berhasil disegarkan!")}
            className="btn-primary-action"
            title="Refresh data analitik"
          >
            <RefreshCw size={16} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 RINGKASAN METRIK PILAR SEKALIGUS NAVIGASI CEPAT                         */}
      {/* ========================================================================= */}
      <div className="analytics-pillar-cards mb-4">
        {/* Pilar 1: Track Halaman */}
        <Link 
          to="/tracking/pages"
          className={`pillar-card ${activeMode === "pages" ? "active-pillar" : ""}`}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box blue">
              <FileText size={20} />
            </div>
            <span className="pillar-badge">Submenu 1</span>
          </div>
          <span className="pillar-label">1. Track Halaman</span>
          <div className="pillar-value">{summary.totalViews.toLocaleString("id-ID")} <span className="pillar-unit">Views</span></div>
          <p className="pillar-desc">Frekuensi akses pengunjung ke setiap URL halaman</p>
        </Link>

        {/* Pilar 2: Track Section */}
        <Link 
          to="/tracking/sections"
          className={`pillar-card ${activeMode === "sections" ? "active-pillar" : ""}`}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box purple">
              <ArrowDown size={20} />
            </div>
            <span className="pillar-badge">Submenu 2</span>
          </div>
          <span className="pillar-label">2. Track Section (Scroll)</span>
          <div className="pillar-value">{summary.avgScroll} <span className="pillar-unit">Kedalaman</span></div>
          <p className="pillar-desc">Deteksi scroll user dari Hero (0%) sampai Footer (100%)</p>
        </Link>

        {/* Pilar 3: Track Button */}
        <Link 
          to="/tracking/buttons"
          className={`pillar-card ${activeMode === "buttons" ? "active-pillar" : ""}`}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box green">
              <MousePointerClick size={20} />
            </div>
            <span className="pillar-badge">Submenu 3</span>
          </div>
          <span className="pillar-label">3. Track Button (Klik)</span>
          <div className="pillar-value">{summary.totalClicks.toLocaleString("id-ID")} <span className="pillar-unit">Klik</span></div>
          <p className="pillar-desc">Jumlah interaksi klik tombol WhatsApp & pendaftaran</p>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* FILTER PERIODE WAKTU & BREADCRUMB SUBMENU                                 */}
      {/* ========================================================================= */}
      <div className="analytics-filter-bar mb-4">
        <div className="analytics-main-tabs">
          <Link
            to="/tracking"
            className={`analytics-tab-btn ${activeMode === "overview" ? "active" : ""}`}
          >
            <BarChart3 size={15} />
            <span>Ringkasan</span>
          </Link>
          <Link
            to="/tracking/pages"
            className={`analytics-tab-btn ${activeMode === "pages" ? "active" : ""}`}
          >
            <FileText size={15} />
            <span>Track Halaman</span>
          </Link>
          <Link
            to="/tracking/sections"
            className={`analytics-tab-btn ${activeMode === "sections" ? "active" : ""}`}
          >
            <Layers size={15} />
            <span>Track Section (Scroll)</span>
          </Link>
          <Link
            to="/tracking/buttons"
            className={`analytics-tab-btn ${activeMode === "buttons" ? "active" : ""}`}
          >
            <MousePointerClick size={15} />
            <span>Track Button (Klik)</span>
          </Link>
        </div>

        {/* Periode Filter */}
        <div className="analytics-pill-tabs ml-auto">
          <button
            onClick={() => setTimeRange("today")}
            className={`analytics-pill ${timeRange === "today" ? "active" : ""}`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`analytics-pill ${timeRange === "7d" ? "active" : ""}`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`analytics-pill ${timeRange === "30d" ? "active" : ""}`}
          >
            30 Hari
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`analytics-pill ${timeRange === "all" ? "active" : ""}`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBMENU 1: TRACK HALAMAN (PAGE TRACKING)                                  */}
      {/* ========================================================================= */}
      {(activeMode === "pages" || activeMode === "overview") && (
        <div className="tab-content-area mb-4">
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">
                  {activeMode === "overview" ? "Ringkasan Kunjungan Halaman Website" : "1. Detail Pelacakan Halaman (Page Tracking)"}
                </h3>
                <p className="section-subtitle">
                  Menghitung berapa banyak user yang mengakses masing-masing halaman website
                </p>
              </div>
              <div className="analytics-search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari halaman atau path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="analytics-search-input"
                />
              </div>
            </div>

            <div className="cms-table-responsive">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Halaman Website</th>
                    <th>Path URL</th>
                    <th>Total Views</th>
                    <th>Pengunjung Unik</th>
                    <th>Rata-rata Waktu</th>
                    <th>Perangkat Dominan</th>
                    <th>Sumber Utama</th>
                    <th>Porsi Trafik</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pagesList.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-center gap-2">
                          <FileText size={16} className="text-blue flex-shrink-0" />
                          <span className="font-semibold text-main">{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <code className="code-path">{p.path}</code>
                      </td>
                      <td>
                        <span className="font-bold text-main">{p.views.toLocaleString("id-ID")}</span>
                      </td>
                      <td>
                        <span className="text-secondary">{p.uniqueVisitors.toLocaleString("id-ID")} org</span>
                      </td>
                      <td>
                        <div className="d-flex align-center gap-1 text-sm text-secondary">
                          <Clock size={13} />
                          <span>{p.avgDuration}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-tag-browser">{p.topDevice}</span>
                      </td>
                      <td>
                        <span className="text-sm text-secondary">{p.topSource}</span>
                      </td>
                      <td>
                        <div className="d-flex align-center gap-2" style={{ minWidth: "100px" }}>
                          <div className="page-progress-track flex-1">
                            <div className="page-progress-fill" style={{ width: `${p.share}%` }} />
                          </div>
                          <span className="text-xs font-bold text-main">{p.share}%</span>
                        </div>
                      </td>
                      <td>
                        <a 
                          href={p.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn-link-action"
                          title="Buka halaman live di tab baru"
                        >
                          <span>Buka</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMENU 2: TRACK SECTION (SCROLL DEPTH FUNNEL)                             */}
      {/* ========================================================================= */}
      {(activeMode === "sections" || activeMode === "overview") && (
        <div className="tab-content-area mb-4">
          {/* Penjelasan Logika Scroll Sesuai Request User */}
          <div className="scroll-logic-info-card mb-4">
            <div className="logic-icon-wrap">
              <Info size={22} className="text-blue" />
            </div>
            <div className="logic-text-content">
              <h4 className="logic-title">Perhitungan Scroll Depth Section: 0% (Hero/Navbar) s/d 100% (Footer)</h4>
              <p className="logic-desc">
                Sistem mendeteksi scroll user secara realtime. Contoh: jika <strong>Section Keunggulan</strong> berada di posisi <strong>30%</strong>,
                dan user hanya scroll sampai <strong>20%</strong>, maka section tersebut <strong>belum terhitung</strong>.
                Section baru terhitung ketika user scroll mencapai atau melampaui posisi section tersebut.
              </p>
            </div>
          </div>

          {/* Selector Halaman untuk Analisis Scroll */}
          <div className="section-page-selector-bar mb-4">
            <span className="selector-label">Pilih Halaman untuk Dianalisis:</span>
            <div className="selector-buttons">
              <button
                onClick={() => setSelectedSectionPage("/")}
                className={`selector-btn ${selectedSectionPage === "/" ? "active" : ""}`}
              >
                Halaman Beranda (Home)
              </button>
              <button
                onClick={() => setSelectedSectionPage("/tentang-kami")}
                className={`selector-btn ${selectedSectionPage === "/tentang-kami" ? "active" : ""}`}
              >
                Halaman Tentang Kami (About)
              </button>
              <button
                onClick={() => setSelectedSectionPage("/berita-artikel")}
                className={`selector-btn ${selectedSectionPage === "/berita-artikel" ? "active" : ""}`}
              >
                Katalog Berita & Edukasi
              </button>
            </div>
            <div className="selector-stat ml-auto">
              <span>Rata-rata Scroll Pengunjung: <strong>{currentSectionData.avgScrollDepth}</strong></span>
            </div>
          </div>

          {/* Funnel Visualisasi Scroll per Section */}
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Funnel Scroll Section: {currentSectionData.pageName}</h3>
                <p className="section-subtitle">
                  Persentase pengunjung yang berhasil mencapai tiap section dari total {currentSectionData.totalVisits.toLocaleString("id-ID")} kunjungan
                </p>
              </div>
              <div className="badge-module-status active-green">Ambang Batas Terkalibrasi</div>
            </div>

            <div className="scroll-funnel-list">
              {currentSectionData.sections.map((sec, idx) => (
                <div key={sec.id} className="funnel-step-card">
                  <div className="funnel-step-left">
                    <div className="funnel-step-num-col">
                      <span className="step-num-badge">#{idx + 1}</span>
                      <span className="step-pos-pct">{sec.positionPct}</span>
                    </div>
                    <div className="funnel-step-details">
                      <div className="d-flex align-center gap-2">
                        <h4 className="step-title">{sec.name}</h4>
                        <span className="badge-step-status">{sec.status}</span>
                      </div>
                      <p className="step-desc">{sec.description}</p>
                    </div>
                  </div>

                  <div className="funnel-step-right">
                    <div className="funnel-metric-box">
                      <div className="metric-pct">{sec.reachedPct}%</div>
                      <div className="metric-count">{sec.reachedCount.toLocaleString("id-ID")} pengunjung</div>
                    </div>
                    <div className="funnel-progress-container">
                      <div 
                        className={`funnel-progress-bar ${sec.reachedPct > 80 ? "high" : sec.reachedPct > 50 ? "medium" : "low"}`}
                        style={{ width: `${sec.reachedPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">Drop-off: {sec.dropOffRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMENU 3: TRACK BUTTON (CLICK EVENTS & CTA)                              */}
      {/* ========================================================================= */}
      {(activeMode === "buttons" || activeMode === "overview") && (
        <div className="tab-content-area mb-4">
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">
                  {activeMode === "overview" ? "Ringkasan Interaksi Tombol CTA" : "3. Detail Pelacakan Klik Tombol (Button Tracking)"}
                </h3>
                <p className="section-subtitle">
                  Mendeteksi berapa kali user mengklik tombol pendaftaran, kontak WhatsApp, dan aksi penting lainnya
                </p>
              </div>
              <div className="analytics-search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari tombol atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="analytics-search-input"
                />
              </div>
            </div>

            <div className="cms-table-responsive">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Nama Tombol (Button Text)</th>
                    <th>Lokasi Penempatan</th>
                    <th>Aksi Saat Diklik</th>
                    <th>Total Klik</th>
                    <th>Pengklik Unik (Users)</th>
                    <th>Rasio Klik (CTR)</th>
                    <th>Tingkat Performa</th>
                  </tr>
                </thead>
                <tbody>
                  {buttonsList.map((btn) => (
                    <tr key={btn.id}>
                      <td>
                        <div className="d-flex align-center gap-2">
                          <div className={`btn-click-icon ${btn.colorBadge}`}>
                            <MousePointerClick size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-main d-block">{btn.name}</span>
                            <span className="text-xs text-muted">ID: {btn.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-secondary font-medium">{btn.pageLocation}</span>
                      </td>
                      <td>
                        <span className="badge-tag-action">{btn.actionType}</span>
                      </td>
                      <td>
                        <span className="font-extrabold text-main">{btn.totalClicks.toLocaleString("id-ID")}</span>
                      </td>
                      <td>
                        <span className="text-secondary">{btn.uniqueClickers.toLocaleString("id-ID")} org</span>
                      </td>
                      <td>
                        <span className="badge-ctr">{btn.ctr}</span>
                      </td>
                      <td>
                        <div className="d-flex align-center gap-1">
                          {btn.performance === "Sangat Tinggi" ? (
                            <span className="badge-performance high">
                              <Flame size={12} /> Sangat Tinggi
                            </span>
                          ) : btn.performance === "Optimal" ? (
                            <span className="badge-performance optimal">
                              <CheckCircle2 size={12} /> Optimal
                            </span>
                          ) : (
                            <span className="badge-performance fair">
                              Cukup
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
