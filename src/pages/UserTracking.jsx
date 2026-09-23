import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Search, 
  RefreshCw, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";

// Mock baseline logs agar visualisasi chart dan metrik langsung terisi kaya data
const BASELINE_LOGS = [
  {
    id: "log_1",
    visitorId: "usr_9k2a1_m8",
    path: "/",
    pageTitle: "Beranda (Home)",
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    displayTime: "3 mnt lalu",
    device: "Mobile",
    browser: "Chrome",
    os: "Android",
    referrer: "Google Search",
  },
  {
    id: "log_2",
    visitorId: "usr_7x1p9_b3",
    path: "/tentang-kami",
    pageTitle: "Tentang Kami (About)",
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    displayTime: "14 mnt lalu",
    device: "Desktop",
    browser: "Safari",
    os: "macOS",
    referrer: "Direct (Langsung)",
  },
  {
    id: "log_3",
    visitorId: "usr_4w8q2_z5",
    path: "/berita-artikel",
    pageTitle: "Katalog Berita & Edukasi",
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    displayTime: "28 mnt lalu",
    device: "Mobile",
    browser: "Safari",
    os: "iOS",
    referrer: "Instagram Bio",
  },
  {
    id: "log_4",
    visitorId: "usr_1b5v7_c9",
    path: "/berita-artikel/keuntungan-kasbon-karyawan-efisiensi-perusahaan",
    pageTitle: "Artikel: Solusi Kasbon Karyawan & Finansial HR",
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    displayTime: "42 mnt lalu",
    device: "Mobile",
    browser: "Chrome",
    os: "Android",
    referrer: "LinkedIn HR Post",
  },
  {
    id: "log_5",
    visitorId: "usr_8p3m4_d2",
    path: "/hubungi-kami",
    pageTitle: "Hubungi Kami (Konsultasi CS)",
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    displayTime: "1 jam lalu",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows",
    referrer: "Google Search",
  },
  {
    id: "log_6",
    visitorId: "usr_2l9k8_j1",
    path: "/",
    pageTitle: "Beranda (Home)",
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    displayTime: "1.5 jam lalu",
    device: "Mobile",
    browser: "Chrome",
    os: "Android",
    referrer: "WhatsApp Share",
  },
  {
    id: "log_7",
    visitorId: "usr_5c4v3_x8",
    path: "/tentang-kami",
    pageTitle: "Tentang Kami (About)",
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    displayTime: "2 jam lalu",
    device: "Tablet",
    browser: "Safari",
    os: "iOS",
    referrer: "Direct (Langsung)",
  },
  {
    id: "log_8",
    visitorId: "usr_6m2n1_k4",
    path: "/",
    pageTitle: "Beranda (Home)",
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    displayTime: "3 jam lalu",
    device: "Desktop",
    browser: "Edge",
    os: "Windows",
    referrer: "Google Search",
  },
];

export default function UserTracking() {
  const [timeRange, setTimeRange] = useState("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadLogs();

    let bc;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel("ayo_kasbon_analytics");
        bc.onmessage = (event) => {
          if (event?.data?.type === "NEW_PAGE_VIEW" && event.data.data) {
            handleIncomingLiveVisit(event.data.data);
          }
        };
      } catch (e) {
        console.debug("BroadcastChannel error", e);
      }
    }

    return () => {
      if (bc) bc.close();
    };
  }, []);

  const loadLogs = () => {
    try {
      const STORAGE_KEY = "ayo_kasbon_traffic_logs";
      const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (local && local.length > 0) {
        const combined = [...local];
        BASELINE_LOGS.forEach((b) => {
          if (!combined.some((c) => c.id === b.id)) {
            combined.push(b);
          }
        });
        setLogs(combined);
      } else {
        setLogs(BASELINE_LOGS);
      }
    } catch (e) {
      setLogs(BASELINE_LOGS);
    }
  };

  const handleIncomingLiveVisit = (visit) => {
    setLogs((prev) => [visit, ...prev.slice(0, 99)]);
    showToast(`🔔 Pengunjung Baru: ${visit.pageTitle} (${visit.device} - ${visit.browser})`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSimulateVisit = () => {
    setIsSimulating(true);
    const pages = [
      { path: "/", title: "Beranda (Home)" },
      { path: "/tentang-kami", title: "Tentang Kami (About)" },
      { path: "/berita-artikel", title: "Katalog Berita & Edukasi" },
      { path: "/hubungi-kami", title: "Hubungi Kami (Konsultasi CS)" },
      { path: "/berita-artikel/keuntungan-kasbon-karyawan-efisiensi-perusahaan", title: "Artikel: Solusi Kasbon EWA Karyawan" },
    ];
    const devices = ["Mobile", "Mobile", "Desktop", "Desktop", "Tablet"];
    const browsers = ["Chrome", "Safari", "Edge", "Firefox"];
    const oss = ["Android", "iOS", "Windows", "macOS"];
    const referrers = ["Google Search", "Direct (Langsung)", "LinkedIn", "Instagram", "WhatsApp"];

    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
    const randomOS = oss[Math.floor(Math.random() * oss.length)];
    const randomReferrer = referrers[Math.floor(Math.random() * referrers.length)];

    const now = new Date();
    const newLog = {
      id: "sim_" + Date.now(),
      visitorId: "usr_" + Math.random().toString(36).substring(2, 7),
      path: randomPage.path,
      pageTitle: randomPage.title,
      timestamp: now.toISOString(),
      displayTime: "Baru saja",
      device: randomDevice,
      browser: randomBrowser,
      os: randomOS,
      referrer: randomReferrer,
    };

    setTimeout(() => {
      setLogs((prev) => [newLog, ...prev]);
      try {
        const STORAGE_KEY = "ayo_kasbon_traffic_logs";
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        existing.unshift(newLog);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 150)));
      } catch (e) {}
      setIsSimulating(false);
      showToast(`🚀 Kunjungan baru tercatat: ${randomPage.title} via ${randomDevice}!`);
    }, 350);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert("Tidak ada data log pengunjung untuk diexport.");
      return;
    }
    const headers = ["ID", "Visitor_ID", "Waktu", "Halaman", "Path", "Perangkat", "Browser", "OS", "Sumber_Trafik"];
    const rows = logs.map((l) => [
      l.id,
      l.visitorId,
      l.timestamp,
      `"${(l.pageTitle || "").replace(/"/g, '""')}"`,
      l.path,
      l.device,
      l.browser,
      l.os,
      `"${(l.referrer || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ayo_kasbon_traffic_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (l) =>
        l.pageTitle?.toLowerCase().includes(q) ||
        l.path?.toLowerCase().includes(q) ||
        l.device?.toLowerCase().includes(q) ||
        l.browser?.toLowerCase().includes(q) ||
        l.referrer?.toLowerCase().includes(q) ||
        l.visitorId?.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  const metrics = useMemo(() => {
    let multiplier = 1;
    let labelPeriod = "7 Hari Terakhir";
    if (timeRange === "today") {
      multiplier = 0.25;
      labelPeriod = "Hari Ini";
    } else if (timeRange === "7d") {
      multiplier = 1;
      labelPeriod = "7 Hari Terakhir";
    } else if (timeRange === "30d") {
      multiplier = 4.2;
      labelPeriod = "30 Hari Terakhir";
    } else {
      multiplier = 12.8;
      labelPeriod = "Semua Waktu";
    }

    const baseViews = Math.round((logs.length * 18 + 142) * multiplier);
    const baseVisitors = Math.round(baseViews * 0.58);
    const avgDuration = "2m 54s";

    return {
      pageviews: baseViews,
      uniqueVisitors: baseVisitors,
      avgDuration,
      labelPeriod,
    };
  }, [logs.length, timeRange]);

  const chartDays = useMemo(() => {
    const days = [];
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const name = dayNames[d.getDay()];
      const dateNum = d.getDate();
      const seed = (d.getDate() * 17 + d.getMonth() * 31) % 45 + 30;
      const count = Math.round(seed * (timeRange === "today" ? 0.35 : 1) + (i === 0 ? logs.length * 2 : 0));
      days.push({
        label: `${name}, ${dateNum}`,
        count,
        isToday: i === 0,
      });
    }
    const max = Math.max(...days.map((d) => d.count), 1);
    return days.map((d) => ({ ...d, heightPct: Math.round((d.count / max) * 100) }));
  }, [logs.length, timeRange]);

  const popularPages = useMemo(() => {
    return [
      { name: "Beranda Utama (Home)", path: "/", views: Math.round(metrics.pageviews * 0.44), share: 44, link: "http://localhost:5173/" },
      { name: "Tentang Kami (Profil & Sejarah)", path: "/tentang-kami", views: Math.round(metrics.pageviews * 0.24), share: 24, link: "http://localhost:5173/tentang-kami" },
      { name: "Katalog Berita & Edukasi", path: "/berita-artikel", views: Math.round(metrics.pageviews * 0.18), share: 18, link: "http://localhost:5173/berita-artikel" },
      { name: "Hubungi Kami (Konsultasi CS)", path: "/hubungi-kami", views: Math.round(metrics.pageviews * 0.09), share: 9, link: "http://localhost:5173/hubungi-kami" },
      { name: "Artikel Finansial & Solusi EWA", path: "/berita-artikel/artikel-populer", views: Math.round(metrics.pageviews * 0.05), share: 5, link: "http://localhost:5173/berita-artikel" },
    ];
  }, [metrics.pageviews]);

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
          <h1 className="cms-page-title">Pelacakan Trafik & Pengunjung Website</h1>
          <p className="cms-page-subtitle">
            Pantau performa lalu lintas web secara komprehensif: jumlah tayangan halaman, pengunjung unik, perangkat pengguna, dan halaman paling diminati.
          </p>
        </div>

        <div className="cms-header-actions">
          <button
            onClick={handleSimulateVisit}
            disabled={isSimulating}
            className="btn-secondary-action"
            title="Kirim simulasi satu kunjungan baru untuk menguji live tracker"
          >
            <Sparkles size={16} className="text-amber" />
            <span>{isSimulating ? "Mencatat..." : "+ Simulasi Kunjungan"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-secondary-action"
            title="Download riwayat log pengunjung ke format CSV"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadLogs}
            className="btn-primary-action"
            title="Muat ulang data statistik"
          >
            <RefreshCw size={16} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Filter Waktu Toolbar */}
      <div className="analytics-filter-bar mb-4">
        <div className="d-flex align-center gap-2">
          <Calendar size={16} className="text-muted" />
          <span className="analytics-filter-label">Rentang Waktu:</span>
        </div>
        <div className="analytics-pill-tabs">
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
            7 Hari Terakhir
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`analytics-pill ${timeRange === "30d" ? "active" : ""}`}
          >
            30 Hari Terakhir
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`analytics-pill ${timeRange === "all" ? "active" : ""}`}
          >
            Sepanjang Waktu
          </button>
        </div>
        <div className="analytics-live-pulse-badge ml-auto">
          <span className="live-dot-pulse"></span>
          <span>Pelacakan Real-time Aktif</span>
        </div>
      </div>

      {/* 1. KARTU METRIK UTAMA (KPI CARDS) */}
      <div className="analytics-kpi-grid mb-4">
        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Tayangan Halaman</span>
            <div className="kpi-icon-box bg-blue-subtle">
              <Eye size={20} className="text-blue" />
            </div>
          </div>
          <div className="kpi-value">{metrics.pageviews.toLocaleString("id-ID")}</div>
          <div className="kpi-footer">
            <span className="kpi-trend positive">
              <TrendingUp size={14} /> +18.4%
            </span>
            <span className="kpi-subtext">vs periode sebelumnya</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Pengunjung Unik (Users)</span>
            <div className="kpi-icon-box bg-emerald-subtle">
              <Users size={20} className="text-emerald" />
            </div>
          </div>
          <div className="kpi-value">{metrics.uniqueVisitors.toLocaleString("id-ID")}</div>
          <div className="kpi-footer">
            <span className="kpi-trend positive">
              <TrendingUp size={14} /> +12.8%
            </span>
            <span className="kpi-subtext">pengguna baru terdata</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Rata-rata Durasi Sesi</span>
            <div className="kpi-icon-box bg-purple-subtle">
              <Clock size={20} className="text-purple" />
            </div>
          </div>
          <div className="kpi-value">{metrics.avgDuration}</div>
          <div className="kpi-footer">
            <span className="kpi-trend neutral">
              <Activity size={14} /> Waktu Baca
            </span>
            <span className="kpi-subtext">interaksi tinggi pada artikel</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Dominasi Akses Mobile</span>
            <div className="kpi-icon-box bg-amber-subtle">
              <Smartphone size={20} className="text-amber" />
            </div>
          </div>
          <div className="kpi-value">64.8%</div>
          <div className="kpi-footer">
            <span className="kpi-trend positive">
              <Smartphone size={14} /> Mayoritas Karyawan
            </span>
            <span className="kpi-subtext">responsif ponsel optimal</span>
          </div>
        </div>
      </div>

      {/* 2. GRAFIK TREN KUNJUNGAN & HALAMAN POPULER */}
      <div className="analytics-row-grid mb-4">
        <div className="analytics-card flex-2">
          <div className="analytics-card-header">
            <div>
              <h3 className="section-title">Tren Kunjungan Harian</h3>
              <p className="section-subtitle">Visualisasi jumlah tayangan halaman per hari ({metrics.labelPeriod})</p>
            </div>
            <div className="badge-module-status success">Trafik Aktif</div>
          </div>

          <div className="analytics-chart-container">
            <div className="analytics-bars-track">
              {chartDays.map((d, idx) => (
                <div key={idx} className="chart-bar-col">
                  <div className="chart-bar-tooltip">
                    <span>{d.count} Kunjungan</span>
                  </div>
                  <div className="chart-bar-slot">
                    <div 
                      className={`chart-bar-fill ${d.isToday ? "today-bar" : ""}`}
                      style={{ height: `${Math.max(d.heightPct, 12)}%` }}
                    />
                  </div>
                  <span className={`chart-bar-label ${d.isToday ? "today-label" : ""}`}>
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-card flex-1">
          <div className="analytics-card-header">
            <div>
              <h3 className="section-title">Halaman Terpopuler</h3>
              <p className="section-subtitle">Berdasarkan proporsi kunjungan</p>
            </div>
          </div>

          <div className="popular-pages-list">
            {popularPages.map((p, idx) => (
              <div key={idx} className="popular-page-item">
                <div className="page-item-info">
                  <span className="page-item-rank">#{idx + 1}</span>
                  <div className="page-item-details">
                    <span className="page-item-name">{p.name}</span>
                    <span className="page-item-path">{p.path}</span>
                  </div>
                  <span className="page-item-views">{p.views} views</span>
                </div>
                <div className="page-progress-track">
                  <div 
                    className="page-progress-fill" 
                    style={{ width: `${p.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DISTRIBUSI PERANGKAT, BROWSER & SUMBER TRAFIK */}
      <div className="analytics-tri-grid mb-4">
        <div className="analytics-mini-card">
          <h4 className="mini-card-title">
            <Smartphone size={16} className="text-blue" />
            <span>Kategori Perangkat</span>
          </h4>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Smartphone (Mobile)</span>
                <strong>65%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill blue" style={{ width: "65%" }}></div></div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Desktop / Laptop</span>
                <strong>31%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill purple" style={{ width: "31%" }}></div></div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Tablet</span>
                <strong>4%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill amber" style={{ width: "4%" }}></div></div>
            </div>
          </div>
        </div>

        <div className="analytics-mini-card">
          <h4 className="mini-card-title">
            <Globe size={16} className="text-emerald" />
            <span>Peramban (Browser)</span>
          </h4>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Google Chrome</span>
                <strong>58%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill green" style={{ width: "58%" }}></div></div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Safari (iOS/macOS)</span>
                <strong>28%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill blue" style={{ width: "28%" }}></div></div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Microsoft Edge & Lainnya</span>
                <strong>14%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill purple" style={{ width: "14%" }}></div></div>
            </div>
          </div>
        </div>

        <div className="analytics-mini-card">
          <h4 className="mini-card-title">
            <TrendingUp size={16} className="text-amber" />
            <span>Sumber Trafik (Channels)</span>
          </h4>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Pencarian Organik Google</span>
                <strong>46%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill green" style={{ width: "46%" }}></div></div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Akses Langsung (Direct URL)</span>
                <strong>28%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill blue" style={{ width: "28%" }}></div></div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label-row">
                <span>Media Sosial & WhatsApp</span>
                <strong>26%</strong>
              </div>
              <div className="breakdown-bar"><div className="breakdown-fill amber" style={{ width: "26%" }}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABEL LOG KUNJUNGAN REALTIME */}
      <div className="dashboard-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="section-title">Log Aktivitas Pengunjung Terkini</h3>
            <p className="section-subtitle">Daftar riwayat kunjungan halaman dengan detail perangkat dan referrer</p>
          </div>
          <div className="analytics-search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Cari halaman, device, atau visitor..."
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
                <th>Waktu</th>
                <th>Halaman Dikunjungi</th>
                <th>Perangkat & OS</th>
                <th>Browser</th>
                <th>Sumber Trafik</th>
                <th>Visitor ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Tidak ada log pengunjung yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 25).map((log) => (
                  <tr key={log.id} className="analytics-log-row">
                    <td>
                      <div className="d-flex align-center gap-2">
                        <span className="live-dot-pulse green"></span>
                        <span className="text-sm font-medium">{log.displayTime || "Baru saja"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="log-page-cell">
                        <span className="log-page-title">{log.pageTitle || log.path}</span>
                        <span className="log-page-path">{log.path}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-center gap-2">
                        {log.device === "Mobile" ? (
                          <Smartphone size={15} className="text-blue" />
                        ) : log.device === "Tablet" ? (
                          <Tablet size={15} className="text-amber" />
                        ) : (
                          <Monitor size={15} className="text-purple" />
                        )}
                        <span className="text-sm">{log.device} ({log.os || "OS"})</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-tag-browser">{log.browser || "Chrome"}</span>
                    </td>
                    <td>
                      <span className="text-sm text-secondary">{log.referrer || "Direct"}</span>
                    </td>
                    <td>
                      <span className="badge-visitor-id">{log.visitorId || "usr_anon"}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
