import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
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
  Share2,
  Archive,
  History,
  Trash2,
  X,
  CalendarDays,
  Check,
  Pause,
  Play,
  Activity,
  AlertCircle
} from "lucide-react";

const BRIDGE_STATS_URL = "http://localhost:5176/api/stats";
const BRIDGE_RESET_URL = "http://localhost:5176/api/reset";

const INITIAL_DRAFTS_ARCHIVE = [
  {
    id: "draft_2026_09_24",
    dateKey: "2026-09-24",
    dayLabel: "Kamis, 24 September 2026",
    archivedAt: "24 Sep 2026, 23:59:59 (Reset Jam 12 Malam)",
    totalViews: 3140,
    uniqueVisitors: 2190,
    avgScrollDepth: "71.4%",
    totalClicks: 827,
    topPage: "Beranda Utama (Home)",
    topButton: "Mulai Sekarang (284 klik)",
    pages: [],
    buttons: []
  }
];

export default function UserTracking() {
  const location = useLocation();
  const { submenu } = useParams();

  // Mode aktif
  const activeMode = useMemo(() => {
    if (submenu === "pages" || location.pathname === "/tracking/pages") return "pages";
    if (submenu === "sections" || location.pathname === "/tracking/sections") return "sections";
    if (submenu === "buttons" || location.pathname === "/tracking/buttons") return "buttons";
    if (submenu === "drafts" || location.pathname === "/tracking/drafts") return "drafts";
    return "overview";
  }, [submenu, location.pathname]);

  // State Auto-Refresh & Realtime
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // detik
  const [countdown, setCountdown] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());

  // State Live Data dari Bridge / Firestore
  const [liveStats, setLiveStats] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  }, []);

  // Fetch Live Data dari Bridge Server (localhost:5176)
  const fetchLiveStats = useCallback(async (isManual = false) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(BRIDGE_STATS_URL, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLiveStats(data);
      }
      setLastRefreshedAt(new Date());
      if (isManual) {
        showToast("🔄 Data pelacakan diperbarui langsung!");
      }
    } catch (err) {
      try {
        const local = localStorage.getItem("ayo_kasbon_live_stats");
        if (local) setLiveStats(JSON.parse(local));
      } catch {}
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  }, [showToast]);

  // Initial fetch & listener Firestore
  useEffect(() => {
    fetchLiveStats();

    let unsubFirestore = null;
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      unsubFirestore = onSnapshot(doc(db, "analytics_daily", todayKey), (snap) => {
        if (snap.exists()) {
          const firestoreData = snap.data();
          setLiveStats((prev) => ({
            ...(prev || {}),
            ...firestoreData
          }));
          setLastRefreshedAt(new Date());
        }
      }, () => {});
    } catch {}

    return () => {
      if (unsubFirestore) unsubFirestore();
    };
  }, [fetchLiveStats]);

  // Countdown timer auto-refresh
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchLiveStats(false);
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, refreshInterval, fetchLiveStats]);

  // State Arsip Draft
  const [draftsList, setDraftsList] = useState(() => {
    try {
      const stored = localStorage.getItem("ayo_kasbon_drafts_archive");
      return stored ? JSON.parse(stored) : INITIAL_DRAFTS_ARCHIVE;
    } catch {
      return INITIAL_DRAFTS_ARCHIVE;
    }
  });

  // State Filter & Modal
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [detailModalType, setDetailModalType] = useState(null);
  const [selectedSectionPage, setSelectedSectionPage] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================================
  // DATA COMPUTED DARI REALTIME STATS
  // =========================================================================
  const pagesList = useMemo(() => {
    if (liveStats && liveStats.pages) {
      const arr = Object.values(liveStats.pages).map((p) => {
        const hasViews = (p.views || 0) > 0;
        return {
          ...p,
          views: p.views || 0,
          uniqueVisitors: p.uniqueVisitors || 0,
          share: p.share || 0,
          avgDuration: hasViews ? (p.avgDuration || "2m 15s") : "-",
          bounceRate: hasViews ? (p.bounceRate || "18.0%") : "-",
          topDevice: hasViews ? (p.topDevice || "Desktop") : "-",
          topSource: hasViews ? (p.topSource || "Direct URL") : "-",
          liveUrl: "http://localhost:5175" + p.path,
          browserBreakdown: p.browserBreakdown || {},
          deviceBreakdown: p.deviceBreakdown || {},
          referrerBreakdown: p.referrerBreakdown || {},
          peakHours: p.peakHours || "Aktif Real-time",
          lastVisitTime: p.lastVisitTime || "-"
        };
      });

      return arr.filter((p) => 
        !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.path.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return [];
  }, [liveStats, searchQuery]);

  const currentSectionData = useMemo(() => {
    if (liveStats && liveStats.sections && liveStats.sections[selectedSectionPage]) {
      return liveStats.sections[selectedSectionPage];
    }
    return {
      pageName: selectedSectionPage === "/" ? "Beranda Utama (Home)" : "Tentang Kami (About)",
      avgScrollDepth: "0%",
      totalVisits: 0,
      sections: []
    };
  }, [liveStats, selectedSectionPage]);

  const buttonsList = useMemo(() => {
    if (liveStats && liveStats.buttons && liveStats.buttons.length > 0) {
      return liveStats.buttons.filter((b) => 
        !searchQuery.trim() || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.pageLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  }, [liveStats, searchQuery]);

  const todaySummary = useMemo(() => {
    if (liveStats) {
      return {
        totalViews: liveStats.totalViews || 0,
        totalClicks: liveStats.totalClicks || 0,
        avgScroll: liveStats.avgScrollDepth || "0%",
        uniqueVisitors: liveStats.uniqueVisitors || 0
      };
    }
    return { totalViews: 0, totalClicks: 0, avgScroll: "0%", uniqueVisitors: 0 };
  }, [liveStats]);

  const recentEvents = useMemo(() => {
    return liveStats?.recentEvents || [];
  }, [liveStats]);

  // =========================================================================
  // ACTIONS
  // =========================================================================
  const handleClearTodayData = async () => {
    try {
      await fetch(BRIDGE_RESET_URL, { method: "POST" });
    } catch {}
    fetchLiveStats();
    showToast("🧹 Data hari berjalan berhasil dikosongkan (Mulai dari nol).");
  };

  const handleMidnightReset = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const dateKey = today.toISOString().slice(0, 10);

    const newArchivedDraft = {
      id: "draft_" + Date.now(),
      dateKey,
      dayLabel: dateStr,
      archivedAt: dateStr + ", 23:59:59 (Reset Otomatis 24 Jam)",
      totalViews: todaySummary.totalViews,
      uniqueVisitors: todaySummary.uniqueVisitors,
      avgScrollDepth: todaySummary.avgScroll,
      totalClicks: todaySummary.totalClicks,
      topPage: "Beranda Utama (Home)",
      topButton: "Mulai Sekarang",
      pages: pagesList,
      buttons: buttonsList
    };

    const updated = [newArchivedDraft, ...draftsList];
    setDraftsList(updated);
    try {
      localStorage.setItem("ayo_kasbon_drafts_archive", JSON.stringify(updated));
    } catch {}

    handleClearTodayData();
    showToast("🌙 Data hari ini berhasil diarsipkan ke menu Draft dan direset kosong (0).");
  };

  const openDetailModal = (item, type) => {
    setSelectedDetailItem(item);
    setDetailModalType(type);
  };

  const closeDetailModal = () => {
    setSelectedDetailItem(null);
    setDetailModalType(null);
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
            {activeMode === "sections" && "2. Pelacakan Section & Scroll Depth (0% - 100%)"}
            {activeMode === "buttons" && "3. Pelacakan Klik Tombol (Button Tracking)"}
            {activeMode === "drafts" && "4. Draft & Riwayat Arsip Harian (Reset 24 Jam)"}
            {activeMode === "overview" && "Ringkasan Pelacakan Pengunjung & Trafik"}
          </h1>
          <p className="cms-page-subtitle">
            Pelacakan real-time dari website company profile (<a href="http://localhost:5175/" target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>localhost:5175</a>).
          </p>
        </div>

        <div className="cms-header-actions">
          {todaySummary.totalViews > 0 && (
            <button
              onClick={handleClearTodayData}
              className="btn-secondary-action text-danger"
              title="Kosongkan data hari ini untuk mulai bersih dari nol"
            >
              <Trash2 size={16} />
              <span>Kosongkan Hari Ini (0)</span>
            </button>
          )}

          <button
            onClick={handleMidnightReset}
            className="btn-primary-action"
            style={{ background: "#4338ca" }}
            title="Arsipkan ke Draft dan reset kosong"
          >
            <History size={16} />
            <span>Simulasi Reset Jam 12 Malam</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOOLBAR AUTO-REFRESH & SINKRONISASI REAL-TIME                             */}
      {/* ========================================================================= */}
      <div className="auto-refresh-toolbar">
        <div className="auto-refresh-left">
          <div className={"auto-refresh-status-badge " + (autoRefreshEnabled ? "active" : "paused")}>
            <span className={"live-pulse-radar " + (autoRefreshEnabled ? "green" : "amber")}></span>
            <span>{autoRefreshEnabled ? "Auto-Refresh: Aktif" : "Auto-Refresh: Dijeda"}</span>
          </div>

          {autoRefreshEnabled && (
            <div className="auto-refresh-countdown-pill">
              <Clock size={13} className="text-blue" />
              <span>Refresh otomatis dalam: <strong className="countdown-number">{countdown}s</strong></span>
            </div>
          )}

          <div className="last-refreshed-label">
            <span>Diperbarui:</span>
            <strong>{lastRefreshedAt.toLocaleTimeString("id-ID")} WIB</strong>
          </div>
        </div>

        <div className="auto-refresh-right">
          <div className="interval-select-group">
            <span className="text-xs text-muted" style={{ paddingLeft: "4px" }}>Jeda:</span>
            {[3, 5, 10, 30].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setRefreshInterval(sec);
                  setCountdown(sec);
                }}
                className={"interval-select-btn " + (refreshInterval === sec ? "active" : "")}
              >
                {sec}s
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoRefreshEnabled((prev) => !prev)}
            className="btn-toggle-refresh"
          >
            {autoRefreshEnabled ? <><Pause size={13} /> <span>Jeda</span></> : <><Play size={13} /> <span>Lanjutkan</span></>}
          </button>

          <button
            onClick={() => {
              setCountdown(refreshInterval);
              fetchLiveStats(true);
            }}
            className="btn-instant-refresh"
          >
            <RefreshCw size={13} className={isRefreshing ? "spin-icon-active" : ""} />
            <span>{isRefreshing ? "Menyinkronkan..." : "Refresh Sekarang"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 KARTU NAVIGASI SUBMENU                                                  */}
      {/* ========================================================================= */}
      <div className="analytics-pillar-cards-4 mb-4">
        <Link 
          to="/tracking/pages"
          className={"pillar-card " + (activeMode === "pages" ? "active-pillar" : "")}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box blue">
              <FileText size={20} />
            </div>
            <span className="pillar-badge">Submenu 1</span>
          </div>
          <span className="pillar-label">1. Track Halaman</span>
          <div className="pillar-value">{todaySummary.totalViews.toLocaleString("id-ID")} <span className="pillar-unit">Views</span></div>
          <p className="pillar-desc">Frekuensi akses pengunjung ke setiap URL halaman</p>
        </Link>

        <Link 
          to="/tracking/sections"
          className={"pillar-card " + (activeMode === "sections" ? "active-pillar" : "")}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box purple">
              <ArrowDown size={20} />
            </div>
            <span className="pillar-badge">Submenu 2</span>
          </div>
          <span className="pillar-label">2. Track Section (Scroll)</span>
          <div className="pillar-value">{todaySummary.avgScroll} <span className="pillar-unit">Kedalaman</span></div>
          <p className="pillar-desc">Deteksi scroll user dari Hero (0%) sampai Footer (100%)</p>
        </Link>

        <Link 
          to="/tracking/buttons"
          className={"pillar-card " + (activeMode === "buttons" ? "active-pillar" : "")}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box green">
              <MousePointerClick size={20} />
            </div>
            <span className="pillar-badge">Submenu 3</span>
          </div>
          <span className="pillar-label">3. Track Button (Klik)</span>
          <div className="pillar-value">{todaySummary.totalClicks.toLocaleString("id-ID")} <span className="pillar-unit">Klik</span></div>
          <p className="pillar-desc">Jumlah interaksi klik tombol WhatsApp & pendaftaran</p>
        </Link>

        <Link 
          to="/tracking/drafts"
          className={"pillar-card " + (activeMode === "drafts" ? "active-pillar" : "")}
        >
          <div className="pillar-card-top">
            <div className="pillar-icon-box amber">
              <Archive size={20} />
            </div>
            <span className="pillar-badge" style={{ background: "#fef3c7", color: "#b45309" }}>Submenu 4</span>
          </div>
          <span className="pillar-label">4. Draft & Riwayat Harian</span>
          <div className="pillar-value">{draftsList.length} <span className="pillar-unit">Hari Tersimpan</span></div>
          <p className="pillar-desc">Arsip otomatis setiap 24 jam (jam 12 malam)</p>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* BREADCRUMB TABS                                                           */}
      {/* ========================================================================= */}
      <div className="analytics-filter-bar mb-4">
        <div className="analytics-main-tabs">
          <Link
            to="/tracking"
            className={"analytics-tab-btn " + (activeMode === "overview" ? "active" : "")}
          >
            <BarChart3 size={15} />
            <span>Ringkasan</span>
          </Link>
          <Link
            to="/tracking/pages"
            className={"analytics-tab-btn " + (activeMode === "pages" ? "active" : "")}
          >
            <FileText size={15} />
            <span>1. Track Halaman</span>
          </Link>
          <Link
            to="/tracking/sections"
            className={"analytics-tab-btn " + (activeMode === "sections" ? "active" : "")}
          >
            <Layers size={15} />
            <span>2. Track Section (Scroll)</span>
          </Link>
          <Link
            to="/tracking/buttons"
            className={"analytics-tab-btn " + (activeMode === "buttons" ? "active" : "")}
          >
            <MousePointerClick size={15} />
            <span>3. Track Button (Klik)</span>
          </Link>
          <Link
            to="/tracking/drafts"
            className={"analytics-tab-btn " + (activeMode === "drafts" ? "active" : "")}
          >
            <Archive size={15} />
            <span>4. Draft & Riwayat Harian</span>
          </Link>
        </div>

        <div className="analytics-live-pulse-badge ml-auto">
          <span className="live-dot-pulse"></span>
          <span>{todaySummary.totalViews > 0 ? (todaySummary.totalViews + " Kunjungan Real-time") : "Server Real-time Aktif"}</span>
        </div>
      </div>

      {/* Stream Aktivitas Terkini (Hanya di Overview) */}
      {activeMode === "overview" && recentEvents.length > 0 && (
        <div className="live-activity-feed-card">
          <div className="d-flex align-center justify-between">
            <div className="d-flex align-center gap-2">
              <Activity size={18} className="text-emerald" />
              <h3 className="section-title" style={{ margin: 0, fontSize: "15px" }}>Log Kunjungan & Interaksi Terkini</h3>
            </div>
            <span className="text-xs text-muted">Real-time Stream</span>
          </div>

          <div className="live-feed-list">
            {recentEvents.map((evt) => (
              <div key={evt.id} className="live-feed-item">
                <div className="feed-item-left">
                  <div className={"feed-badge-icon " + (evt.type === "page_view" ? "blue" : "green")}>
                    {evt.type === "page_view" ? <FileText size={14} /> : <MousePointerClick size={14} />}
                  </div>
                  <div>
                    <div className="feed-item-title">{evt.title}</div>
                    <div className="feed-item-meta">
                      {(evt.meta?.browser || "Browser") + " • " + (evt.meta?.deviceLabel || evt.meta?.device || "Desktop") + " • Sumber: " + (evt.meta?.referrer || "Direct")}
                    </div>
                  </div>
                </div>
                <div className="feed-item-time">{evt.timestamp} WIB</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUBMENU TRACK HALAMAN                                                  */}
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
                  💡 <em>Klik pada baris halaman untuk melihat rincian akurat peramban, perangkat & sumber rujukan</em>
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
                    <th>Porsi Trafik</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pagesList.map((p) => (
                    <tr 
                      key={p.id} 
                      onClick={() => openDetailModal(p, "page")}
                      className="cursor-pointer hover-highlight-row"
                    >
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
                        {p.topDevice !== "-" ? (
                          <span className="badge-tag-browser">{p.topDevice}</span>
                        ) : (
                          <span className="text-muted text-sm">-</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-center gap-2" style={{ minWidth: "100px" }}>
                          <div className="page-progress-track flex-1">
                            <div className="page-progress-fill" style={{ width: p.share + "%" }} />
                          </div>
                          <span className="text-xs font-bold text-main">{p.share}%</span>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(p, "page");
                          }}
                          className="btn-detail-pill"
                        >
                          Lihat Detail
                        </button>
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
      {/* 2. SUBMENU TRACK SECTION                                                  */}
      {/* ========================================================================= */}
      {(activeMode === "sections" || activeMode === "overview") && (
        <div className="tab-content-area mb-4">
          <div className="scroll-logic-info-card mb-4">
            <div className="logic-icon-wrap">
              <Info size={22} className="text-blue" />
            </div>
            <div className="logic-text-content">
              <h4 className="logic-title">Perhitungan Scroll Depth: 0% (Hero) s/d 100% (Footer)</h4>
              <p className="logic-desc">
                Sistem mendeteksi scroll user secara realtime. Contoh: jika <strong>Section Keunggulan</strong> berada di posisi <strong>30%</strong>,
                dan user hanya scroll sampai <strong>20%</strong>, maka section tersebut <strong>belum terhitung</strong>.
                Section baru terhitung tercapai jika user scroll melewati batas ambang batas posisi section tersebut.
              </p>
            </div>
          </div>

          <div className="section-page-selector-bar mb-4">
            <span className="selector-label">Pilih Halaman untuk Dianalisis:</span>
            <div className="selector-buttons">
              <button
                onClick={() => setSelectedSectionPage("/")}
                className={"selector-btn " + (selectedSectionPage === "/" ? "active" : "")}
              >
                Halaman Beranda (Home)
              </button>
              <button
                onClick={() => setSelectedSectionPage("/tentang-kami")}
                className={"selector-btn " + (selectedSectionPage === "/tentang-kami" ? "active" : "")}
              >
                Halaman Tentang Kami (About)
              </button>
            </div>
            <div className="selector-stat ml-auto">
              <span>Rata-rata Scroll: <strong>{currentSectionData.avgScrollDepth}</strong></span>
            </div>
          </div>

          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Funnel Scroll Section: {currentSectionData.pageName}</h3>
                <p className="section-subtitle">
                  💡 <em>Klik pada kartu section untuk melihat rincian pengguna</em>
                </p>
              </div>
              <div className="badge-module-status active-green">Ambang Batas Terkalibrasi</div>
            </div>

            <div className="scroll-funnel-list">
              {currentSectionData.sections?.map((sec, idx) => (
                <div 
                  key={sec.id} 
                  onClick={() => openDetailModal(sec, "section")}
                  className="funnel-step-card cursor-pointer hover-highlight-card"
                >
                  <div className="funnel-step-left">
                    <div className="funnel-step-num-col">
                      <span className="step-num-badge">#{(idx + 1)}</span>
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
                        className={"funnel-progress-bar " + (sec.reachedPct > 80 ? "high" : sec.reachedPct > 50 ? "medium" : "low")}
                        style={{ width: sec.reachedPct + "%" }}
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
      {/* 3. SUBMENU TRACK BUTTON                                                   */}
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
                  💡 <em>Klik pada baris tombol untuk melihat rincian browser & perangkat yang paling banyak mengklik</em>
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
                    <th>Nama Tombol</th>
                    <th>Lokasi Penempatan</th>
                    <th>Aksi Saat Diklik</th>
                    <th>Total Klik</th>
                    <th>Pengklik Unik</th>
                    <th>Rasio Klik (CTR)</th>
                    <th>Tingkat Performa</th>
                  </tr>
                </thead>
                <tbody>
                  {buttonsList.map((btn) => (
                    <tr 
                      key={btn.id} 
                      onClick={() => openDetailModal(btn, "button")}
                      className="cursor-pointer hover-highlight-row"
                    >
                      <td>
                        <div className="d-flex align-center gap-2">
                          <div className={"btn-click-icon " + (btn.colorBadge || "blue")}>
                            <MousePointerClick size={16} />
                          </div>
                          <span className="font-bold text-main">{btn.name}</span>
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
                          ) : (
                            <span className="badge-performance optimal">
                              <CheckCircle2 size={12} /> Optimal
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

      {/* ========================================================================= */}
      {/* 4. SUBMENU DRAFT & RIWAYAT HARIAN                                         */}
      {/* ========================================================================= */}
      {activeMode === "drafts" && (
        <div className="tab-content-area mb-4">
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Arsip Harian & Riwayat Log 24 Jam</h3>
                <p className="section-subtitle">
                  Setiap pergantian hari pukul 00:00 (jam 12 malam), data live otomatis diarsipkan ke daftar draft ini. Klik pada salah satu hari untuk membaca laporan detailnya.
                </p>
              </div>
            </div>

            <div className="drafts-archive-list">
              {draftsList.map((draft) => (
                <div 
                  key={draft.id} 
                  className="draft-day-card"
                  onClick={() => openDetailModal(draft, "draft_view")}
                >
                  <div className="draft-card-header">
                    <div className="d-flex align-center gap-2">
                      <div className="draft-icon-box">
                        <CalendarDays size={20} className="text-amber" />
                      </div>
                      <div>
                        <h4 className="draft-day-title">{draft.dayLabel}</h4>
                        <span className="draft-timestamp-badge">{draft.archivedAt}</span>
                      </div>
                    </div>

                    <button type="button" className="btn-view-draft">
                      <span>Buka Detail Hari Ini</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="draft-summary-pills">
                    <div className="draft-pill">
                      <span className="label">Total Views:</span>
                      <strong>{draft.totalViews.toLocaleString("id-ID")}</strong>
                    </div>
                    <div className="draft-pill">
                      <span className="label">Rata-rata Scroll:</span>
                      <strong>{draft.avgScrollDepth}</strong>
                    </div>
                    <div className="draft-pill">
                      <span className="label">Klik Tombol:</span>
                      <strong>{draft.totalClicks.toLocaleString("id-ID")}</strong>
                    </div>
                    <div className="draft-pill">
                      <span className="label">Top Page:</span>
                      <strong className="text-blue">{draft.topPage}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL POPUP DETAIL (BROWSER, PERANGKAT, REFERRER)                         */}
      {/* ========================================================================= */}
      {selectedDetailItem && (
        <div className="analytics-modal-backdrop" onClick={closeDetailModal}>
          <div className="analytics-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="d-flex align-center gap-2">
                {detailModalType === "page" && <FileText size={22} className="text-blue" />}
                {detailModalType === "section" && <Layers size={22} className="text-purple" />}
                {detailModalType === "button" && <MousePointerClick size={22} className="text-emerald" />}
                {detailModalType === "draft_view" && <Archive size={22} className="text-amber" />}
                <div>
                  <h3 className="modal-title">
                    {detailModalType === "page" && ("Detail Kunjungan: " + selectedDetailItem.name)}
                    {detailModalType === "section" && ("Detail Scroll: " + selectedDetailItem.name)}
                    {detailModalType === "button" && ("Detail Interaksi: " + selectedDetailItem.name)}
                    {detailModalType === "draft_view" && ("Laporan Lengkap: " + selectedDetailItem.dayLabel)}
                  </h3>
                  <span className="modal-subtitle">
                    {detailModalType === "page" && ("Path: " + selectedDetailItem.path + " • Total " + selectedDetailItem.views + " Tayangan")}
                    {detailModalType === "section" && ("Posisi " + selectedDetailItem.positionPct + " • " + selectedDetailItem.reachedCount + " Pengunjung Mencapai")}
                    {detailModalType === "button" && ("Lokasi: " + selectedDetailItem.pageLocation + " • Total " + selectedDetailItem.totalClicks + " Klik")}
                    {detailModalType === "draft_view" && selectedDetailItem.archivedAt}
                  </span>
                </div>
              </div>

              <button onClick={closeDetailModal} className="modal-btn-close" aria-label="Tutup">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* TIPE 1: DETAIL HALAMAN */}
              {detailModalType === "page" && (
                <div>
                  {selectedDetailItem.views === 0 ? (
                    <div className="empty-tracker-notice-box" style={{ margin: "20px 0" }}>
                      <AlertCircle size={22} className="text-amber" />
                      <div className="notice-text">
                        <strong>Belum Ada Kunjungan Tercatat Hari Ini</strong>
                        <p>
                          Halaman ini belum diakses oleh pengunjung hari ini. Buka <a href={selectedDetailItem.liveUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 700 }}>{selectedDetailItem.liveUrl}</a> di browser Anda untuk mulai merekam data kunjungan secara real-time.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="modal-detail-grid">
                      {/* Browser Breakdown */}
                      <div className="modal-info-card">
                        <h4 className="info-card-heading">
                          <Globe size={16} className="text-emerald" />
                          <span>Rincian Peramban (Browser)</span>
                        </h4>
                        <div className="breakdown-stat-rows">
                          {selectedDetailItem.browserBreakdown && Object.entries(selectedDetailItem.browserBreakdown).length > 0 ? (
                            Object.entries(selectedDetailItem.browserBreakdown).map(([browser, val]) => {
                              const pctStr = typeof val === "object" ? val.pct : (String(val).endsWith("%") ? val : val + "%");
                              const countStr = typeof val === "object" ? (val.count + " tayangan") : "";
                              const pctNum = typeof val === "object" ? val.pctNum : parseInt(val) || 0;
                              return (
                                <div key={browser} className="breakdown-stat-row">
                                  <div className="d-flex align-center justify-between" style={{ width: "100%", marginBottom: "4px" }}>
                                    <span className="stat-name font-medium">{browser}</span>
                                    <div className="d-flex align-center gap-2">
                                      {countStr && <span className="text-xs text-secondary">{countStr}</span>}
                                      <span className="stat-val font-bold text-main">{pctStr}</span>
                                    </div>
                                  </div>
                                  <div className="stat-bar-track">
                                    <div className="stat-bar-fill green" style={{ width: pctNum + "%" }}></div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-muted text-sm">Belum ada rincian</span>
                          )}
                        </div>
                      </div>

                      {/* Device Breakdown */}
                      <div className="modal-info-card">
                        <h4 className="info-card-heading">
                          <Smartphone size={16} className="text-blue" />
                          <span>Rincian Perangkat & Sistem Operasi</span>
                        </h4>
                        <div className="breakdown-stat-rows">
                          {selectedDetailItem.deviceBreakdown && Object.entries(selectedDetailItem.deviceBreakdown).length > 0 ? (
                            Object.entries(selectedDetailItem.deviceBreakdown).map(([device, val]) => {
                              const pctStr = typeof val === "object" ? val.pct : (String(val).endsWith("%") ? val : val + "%");
                              const countStr = typeof val === "object" ? (val.count + " tayangan") : "";
                              const pctNum = typeof val === "object" ? val.pctNum : parseInt(val) || 0;
                              return (
                                <div key={device} className="breakdown-stat-row">
                                  <div className="d-flex align-center justify-between" style={{ width: "100%", marginBottom: "4px" }}>
                                    <span className="stat-name font-medium">{device}</span>
                                    <div className="d-flex align-center gap-2">
                                      {countStr && <span className="text-xs text-secondary">{countStr}</span>}
                                      <span className="stat-val font-bold text-main">{pctStr}</span>
                                    </div>
                                  </div>
                                  <div className="stat-bar-track">
                                    <div className="stat-bar-fill blue" style={{ width: pctNum + "%" }}></div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-muted text-sm">Belum ada rincian</span>
                          )}
                        </div>
                      </div>

                      {/* Referrer Breakdown */}
                      <div className="modal-info-card">
                        <h4 className="info-card-heading">
                          <Share2 size={16} className="text-purple" />
                          <span>Saluran Rujukan (Referrer)</span>
                        </h4>
                        <div className="breakdown-stat-rows">
                          {selectedDetailItem.referrerBreakdown && Object.entries(selectedDetailItem.referrerBreakdown).length > 0 ? (
                            Object.entries(selectedDetailItem.referrerBreakdown).map(([ref, val]) => {
                              const pctStr = typeof val === "object" ? val.pct : (String(val).endsWith("%") ? val : val + "%");
                              const countStr = typeof val === "object" ? (val.count + " tayangan") : "";
                              const pctNum = typeof val === "object" ? val.pctNum : parseInt(val) || 0;
                              return (
                                <div key={ref} className="breakdown-stat-row">
                                  <div className="d-flex align-center justify-between" style={{ width: "100%", marginBottom: "4px" }}>
                                    <span className="stat-name font-medium">{ref}</span>
                                    <div className="d-flex align-center gap-2">
                                      {countStr && <span className="text-xs text-secondary">{countStr}</span>}
                                      <span className="stat-val font-bold text-main">{pctStr}</span>
                                    </div>
                                  </div>
                                  <div className="stat-bar-track">
                                    <div className="stat-bar-fill purple" style={{ width: pctNum + "%" }}></div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-muted text-sm">Belum ada rincian</span>
                          )}
                        </div>
                      </div>

                      {/* Waktu Kunjungan */}
                      <div className="modal-info-card">
                        <h4 className="info-card-heading">
                          <Clock size={16} className="text-amber" />
                          <span>Waktu Kunjungan Aktif</span>
                        </h4>
                        <div className="peak-hours-box">
                          <div className="peak-hour-badge">{selectedDetailItem.peakHours || "Aktif Real-time"}</div>
                          <p className="text-sm text-secondary mt-2">
                            Kunjungan terakhir: <strong>{selectedDetailItem.lastVisitTime || "Baru saja"}</strong>. Total <strong>{selectedDetailItem.views} tayangan</strong> dari <strong>{selectedDetailItem.uniqueVisitors} pengunjung unik</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TIPE 2: DETAIL SECTION */}
              {detailModalType === "section" && (
                <div className="modal-detail-grid">
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <TrendingUp size={16} className="text-blue" />
                      <span>Retensi Pembaca di Section Ini</span>
                    </h4>
                    <div className="metric-large-text">{selectedDetailItem.reachedPct}%</div>
                    <p className="text-sm text-secondary">
                      {selectedDetailItem.reachedCount} orang berhasil scroll dan melihat konten section ini.
                    </p>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Smartphone size={16} className="text-purple" />
                      <span>Proporsi Perangkat</span>
                    </h4>
                    <div className="metric-large-text font-medium text-lg">{selectedDetailItem.deviceShare || "-"}</div>
                  </div>
                </div>
              )}

              {/* TIPE 3: DETAIL TOMBOL */}
              {detailModalType === "button" && (
                <div className="modal-detail-grid">
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <MousePointerClick size={16} className="text-emerald" />
                      <span>Statistik Klik & CTR</span>
                    </h4>
                    <div className="metric-large-text">{selectedDetailItem.totalClicks} <span className="text-sm font-normal text-secondary">Klik Total</span></div>
                    <p className="text-sm text-secondary">
                      Dihasilkan oleh <strong>{selectedDetailItem.uniqueClickers} pengguna unik</strong> dengan CTR <strong>{selectedDetailItem.ctr}</strong>.
                    </p>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Clock size={16} className="text-amber" />
                      <span>Waktu Terakhir Diklik</span>
                    </h4>
                    <div className="peak-hours-box">
                      <div className="peak-hour-badge">{selectedDetailItem.topHour || "-"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TIPE 4: DETAIL DRAFT */}
              {detailModalType === "draft_view" && (
                <div>
                  <div className="draft-view-summary-grid mb-4">
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Total Views</span>
                      <strong className="kpi-num">{selectedDetailItem.totalViews}</strong>
                    </div>
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Pengunjung Unik</span>
                      <strong className="kpi-num">{selectedDetailItem.uniqueVisitors}</strong>
                    </div>
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Rata-rata Scroll</span>
                      <strong className="kpi-num">{selectedDetailItem.avgScrollDepth}</strong>
                    </div>
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Total Klik Tombol</span>
                      <strong className="kpi-num">{selectedDetailItem.totalClicks}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeDetailModal} className="btn-secondary-action">
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
