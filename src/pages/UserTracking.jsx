import React, { useState, useMemo } from "react";
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
  Info
} from "lucide-react";

// =========================================================================
// DATA AWAL / BASELINE UNTUK 3 PILAR PELACAKAN
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
    liveUrl: "http://localhost:5173/hubungi-kami"
  },
  {
    id: "page_art_detail",
    name: "Artikel: Keuntungan Kasbon Karyawan",
    path: "/berita-artikel/keuntungan-kasbon-karyawan-efisiensi-perusahaan",
    views: 130,
    uniqueVisitors: 95,
    avgDuration: "4m 45s",
    bounceRate: "20.0%",
    share: 4,
    liveUrl: "http://localhost:5173/berita-artikel"
  }
];

// 2. Data Track Section (Kedalaman Scroll per Halaman)
const BASE_SECTIONS_DATA = {
  "/": {
    pageName: "Beranda Utama (Home)",
    avgScrollDepth: "71.4%",
    totalVisits: 1420,
    sections: [
      {
        id: "sec_hero",
        name: "Navbar & Hero Banner",
        positionPct: "0% - 20%",
        threshold: 0,
        reachedCount: 1420,
        reachedPct: 100,
        description: "Bagian paling atas website, terlihat saat pertama kali dimuat",
        status: "Semua Terpapar"
      },
      {
        id: "sec_features",
        name: "Section Fitur & Keunggulan Layanan",
        positionPct: "~35%",
        threshold: 30,
        reachedCount: 1220,
        reachedPct: 86,
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
        description: "User scroll 80% ke bawah mendekati akhir halaman",
        status: "Konversi Tinggi"
      },
      {
        id: "sec_footer",
        name: "Footer & Regulasi Resmi (BI / Komdigi)",
        positionPct: "100%",
        threshold: 95,
        reachedCount: 480,
        reachedPct: 34,
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
        description: "Header profil dan ringkasan visi Ayo Kasbon",
        status: "Semua Terpapar"
      },
      {
        id: "sec_about_history",
        name: "Sejarah & Dokumentasi Foto Tim",
        positionPct: "~40%",
        threshold: 35,
        reachedCount: 655,
        reachedPct: 84,
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
        description: "Kontak langsung ke layanan pelanggan",
        status: "Konversi Tinggi"
      },
      {
        id: "sec_about_footer",
        name: "Footer Navigasi & Hak Cipta",
        positionPct: "100%",
        threshold: 95,
        reachedCount: 260,
        reachedPct: 33,
        description: "Akhir halaman Tentang Kami",
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
        description: "Pilihan kategori artikel finansial dan pencarian",
        status: "Semua Terpapar"
      },
      {
        id: "sec_news_featured",
        name: "Artikel Utama Terpilih (Featured Post)",
        positionPct: "~45%",
        threshold: 40,
        reachedCount: 430,
        reachedPct: 83,
        description: "Highlight artikel edukasi paling penting",
        status: "Sangat Populer"
      },
      {
        id: "sec_news_grid",
        name: "Grid Daftar Semua Artikel",
        positionPct: "~75%",
        threshold: 70,
        reachedCount: 320,
        reachedPct: 62,
        description: "Katalog lengkap kartu berita",
        status: "Optimal"
      },
      {
        id: "sec_news_footer",
        name: "Footer & Newsletter Finansial",
        positionPct: "100%",
        threshold: 95,
        reachedCount: 190,
        reachedPct: 37,
        description: "Bagian paling bawah halaman artikel",
        status: "Tuntas Dibaca"
      }
    ]
  }
};

// 3. Data Track Button & Interaksi CTA
const BASE_BUTTONS_DATA = [
  {
    id: "btn_hero_trial",
    name: "Coba Sekarang / Daftar",
    pageLocation: "Beranda - Hero Banner",
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
    pageLocation: "Tentang Kami & Floating WA",
    actionType: "Buka Chat WhatsApp",
    totalClicks: 192,
    uniqueClickers: 175,
    ctr: "24.6%",
    performance: "Sangat Tinggi",
    colorBadge: "emerald"
  },
  {
    id: "btn_header_contact",
    name: "Hubungi Kami (Navbar)",
    pageLocation: "Semua Halaman - Header Atas",
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
    pageLocation: "Beranda - Section Bawah",
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
    actionType: "Buka Halaman Detail",
    totalClicks: 88,
    uniqueClickers: 72,
    ctr: "16.9%",
    performance: "Cukup",
    colorBadge: "amber"
  }
];

export default function UserTracking() {
  const [activeTab, setActiveTab] = useState("pages"); // "pages", "sections", "buttons"
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedSectionPage, setSelectedSectionPage] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Multiplier berdasarkan filter waktu
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

  // Hitung Metrik Ringkasan (Top 3 KPI Cards)
  const summary = useMemo(() => {
    const totalViews = Math.round(3140 * multiplier);
    const totalClicks = Math.round(827 * multiplier);
    const avgScroll = "69.8%";

    return { totalViews, totalClicks, avgScroll };
  }, [multiplier]);

  // Data Halaman yang disesuaikan dengan multiplier
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

  // Data Section untuk halaman terpilih
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

  // Data Tombol yang disesuaikan dengan multiplier
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

  // Simulasi Event Interaktif
  const handleSimulateEvent = (type) => {
    if (type === "page") {
      showToast("🚀 Simulasi: +1 Kunjungan Halaman Beranda tercatat secara realtime!");
    } else if (type === "scroll") {
      showToast("📜 Simulasi: Pengunjung melakukan scroll hingga 85% (Mencapai Section CTA Trial)!");
    } else if (type === "button") {
      showToast("🔘 Simulasi: Tombol 'Coba Sekarang' diklik oleh pengguna (Event Clicks +1)!");
    }
  };

  // Export CSV sesuai tab aktif
  const handleExportCSV = () => {
    let filename = "ayo_kasbon_";
    let rows = [];
    let headers = [];

    if (activeTab === "pages") {
      filename += "track_halaman.csv";
      headers = ["Halaman", "Path", "Total_Views", "Unique_Visitors", "Rata_Rata_Waktu", "Bounce_Rate", "Share_Persen"];
      rows = pagesList.map((p) => [
        `"${p.name}"`,
        p.path,
        p.views,
        p.uniqueVisitors,
        p.avgDuration,
        p.bounceRate,
        p.share + "%"
      ]);
    } else if (activeTab === "sections") {
      filename += "track_section_scroll.csv";
      headers = ["Halaman", "Section", "Posisi_Scroll", "User_Mencapai_Count", "User_Mencapai_Pct", "Status"];
      rows = currentSectionData.sections.map((s) => [
        `"${currentSectionData.pageName}"`,
        `"${s.name}"`,
        s.positionPct,
        s.reachedCount,
        s.reachedPct + "%",
        s.status
      ]);
    } else {
      filename += "track_button_clicks.csv";
      headers = ["Nama_Tombol", "Lokasi_Halaman", "Tipe_Aksi", "Total_Clicks", "Unique_Clickers", "CTR_Pct", "Performa"];
      rows = buttonsList.map((b) => [
        `"${b.name}"`,
        `"${b.pageLocation}"`,
        `"${b.actionType}"`,
        b.totalClicks,
        b.uniqueClickers,
        b.ctr,
        b.performance
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
    showToast(`📥 Berhasil mengunduh laporan ${filename}!`);
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
          <h1 className="cms-page-title">Pelacakan Trafik & Interaksi Pengunjung</h1>
          <p className="cms-page-subtitle">
            Sistem analitik terpadu 3 pilar: pantau frekuensi akses halaman, kedalaman scroll tiap section (0% - 100%), dan efektivitas klik tombol CTA.
          </p>
        </div>

        <div className="cms-header-actions">
          {/* Dropdown Menu Simulasi */}
          <div className="dropdown-simulasi-box">
            <button
              onClick={() => handleSimulateEvent(activeTab === "buttons" ? "button" : activeTab === "sections" ? "scroll" : "page")}
              className="btn-secondary-action"
              title="Kirim simulasi interaksi sesuai tab yang aktif"
            >
              <Sparkles size={16} className="text-amber" />
              <span>+ Simulasi {activeTab === "buttons" ? "Klik Tombol" : activeTab === "sections" ? "Scroll Section" : "Kunjungan Halaman"}</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-secondary-action"
            title="Download data tabel yang aktif ke CSV"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => showToast("🔄 Data analitik berhasil disinkronkan ulang!")}
            className="btn-primary-action"
            title="Sinkronisasi ulang data"
          >
            <RefreshCw size={16} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 RINGKASAN METRIK PILAR (OVERVIEW STATS CARDS)                          */}
      {/* ========================================================================= */}
      <div className="analytics-pillar-cards mb-4">
        {/* Pilar 1: Track Halaman */}
        <div 
          onClick={() => setActiveTab("pages")}
          className={`pillar-card ${activeTab === "pages" ? "active-pillar" : ""}`}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box blue">
              <FileText size={20} />
            </div>
            <span className="pillar-badge">Pilar 1</span>
          </div>
          <span className="pillar-label">1. Track Halaman</span>
          <div className="pillar-value">{summary.totalViews.toLocaleString("id-ID")} <span className="pillar-unit">Views</span></div>
          <p className="pillar-desc">Frekuensi akses pengunjung ke setiap URL halaman</p>
        </div>

        {/* Pilar 2: Track Section */}
        <div 
          onClick={() => setActiveTab("sections")}
          className={`pillar-card ${activeTab === "sections" ? "active-pillar" : ""}`}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box purple">
              <ArrowDown size={20} />
            </div>
            <span className="pillar-badge">Pilar 2</span>
          </div>
          <span className="pillar-label">2. Track Section (Scroll Depth)</span>
          <div className="pillar-value">{summary.avgScroll} <span className="pillar-unit">Rata-rata</span></div>
          <p className="pillar-desc">Deteksi scroll user dari Hero (0%) sampai Footer (100%)</p>
        </div>

        {/* Pilar 3: Track Button */}
        <div 
          onClick={() => setActiveTab("buttons")}
          className={`pillar-card ${activeTab === "buttons" ? "active-pillar" : ""}`}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box green">
              <MousePointerClick size={20} />
            </div>
            <span className="pillar-badge">Pilar 3</span>
          </div>
          <span className="pillar-label">3. Track Button (Klik CTA)</span>
          <div className="pillar-value">{summary.totalClicks.toLocaleString("id-ID")} <span className="pillar-unit">Klik</span></div>
          <p className="pillar-desc">Jumlah interaksi klik tombol WhatsApp & pendaftaran</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FILTER & TAB BAR                                                         */}
      {/* ========================================================================= */}
      <div className="analytics-filter-bar mb-4">
        {/* Navigation Tabs 3 Pilar */}
        <div className="analytics-main-tabs">
          <button
            onClick={() => setActiveTab("pages")}
            className={`analytics-tab-btn ${activeTab === "pages" ? "active" : ""}`}
          >
            <FileText size={16} />
            <span>Track Halaman</span>
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`analytics-tab-btn ${activeTab === "sections" ? "active" : ""}`}
          >
            <Layers size={16} />
            <span>Track Section (Scroll)</span>
          </button>
          <button
            onClick={() => setActiveTab("buttons")}
            className={`analytics-tab-btn ${activeTab === "buttons" ? "active" : ""}`}
          >
            <MousePointerClick size={16} />
            <span>Track Button (Klik)</span>
          </button>
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
      {/* TAB 1: TRACK HALAMAN                                                     */}
      {/* ========================================================================= */}
      {activeTab === "pages" && (
        <div className="tab-content-area">
          <div className="dashboard-section-card mb-4">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Daftar Kunjungan Halaman Website</h3>
                <p className="section-subtitle">
                  Mendeteksi jumlah pengunjung yang membuka dan berinteraksi di setiap URL halaman website
                </p>
              </div>
              <div className="analytics-search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari nama halaman atau path..."
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
                    <th>Total Tayangan (Views)</th>
                    <th>Pengunjung Unik</th>
                    <th>Rata-rata Waktu</th>
                    <th>Bounce Rate</th>
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
                        <span className="text-sm font-medium">{p.bounceRate}</span>
                      </td>
                      <td>
                        <div className="d-flex align-center gap-2" style={{ minWidth: "110px" }}>
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
                          title="Buka halaman live di browser"
                        >
                          <span>Buka</span>
                          <ExternalLink size={13} />
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
      {/* TAB 2: TRACK SECTION (SCROLL DEPTH FUNNEL)                                */}
      {/* ========================================================================= */}
      {activeTab === "sections" && (
        <div className="tab-content-area">
          {/* Info Box Logika Scroll */}
          <div className="scroll-logic-info-card mb-4">
            <div className="logic-icon-wrap">
              <Info size={22} className="text-blue" />
            </div>
            <div className="logic-text-content">
              <h4 className="logic-title">Bagaimana Logika Perhitungan Scroll Section Bekerja?</h4>
              <p className="logic-desc">
                Sistem membaca posisi scroll user dari <strong>0% (Navbar/Hero di bagian paling atas)</strong> sampai <strong>100% (Footer di bagian paling bawah)</strong>.
                Jika suatu section berada di posisi <strong>30%</strong>, dan user hanya scroll sampai <strong>20%</strong>, maka section tersebut <strong>belum terhitung terlihat</strong>.
                Section baru terhitung ketika user benar-benar scroll melewati posisi ambang batas section tersebut.
              </p>
            </div>
          </div>

          {/* Selector Halaman */}
          <div className="section-page-selector-bar mb-4">
            <span className="selector-label">Pilih Halaman yang Dianalisis:</span>
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
              <span>Rata-rata Scroll Depth: <strong>{currentSectionData.avgScrollDepth}</strong></span>
            </div>
          </div>

          {/* Funnel Visualisasi Scroll per Section */}
          <div className="dashboard-section-card mb-4">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Funnel Kedalaman Scroll: {currentSectionData.pageName}</h3>
                <p className="section-subtitle">
                  Persentase pengunjung yang berhasil scroll dan melihat setiap section dari total {currentSectionData.totalVisits.toLocaleString("id-ID")} kunjungan
                </p>
              </div>
              <div className="badge-module-status active-green">Perhitungan Akurat 0% - 100%</div>
            </div>

            <div className="scroll-funnel-list">
              {currentSectionData.sections.map((sec, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === currentSectionData.sections.length - 1;
                return (
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRACK BUTTON (CLICK EVENTS & CTA CONVERSION)                      */}
      {/* ========================================================================= */}
      {activeTab === "buttons" && (
        <div className="tab-content-area">
          <div className="dashboard-section-card mb-4">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Pelacakan Klik Tombol & Interaksi CTA</h3>
                <p className="section-subtitle">
                  Mendeteksi berapa kali user mengklik tombol-tombol konversi penting di seluruh website
                </p>
              </div>
              <div className="analytics-search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari nama tombol atau lokasi..."
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
