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
  Share2,
  Archive,
  History,
  Trash2,
  X,
  CalendarDays,
  Check
} from "lucide-react";

// =========================================================================
// DATA SAMPEL UNTUK GENERATE / SIMULASI HARI INI
// =========================================================================
const SAMPLE_PAGES_TODAY = [
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
    liveUrl: "http://localhost:5173/",
    browserBreakdown: { Chrome: "58%", Safari: "28%", Edge: "8%", Firefox: "6%" },
    deviceBreakdown: { "Android Mobile": "42%", "iOS Mobile": "26%", "macOS": "20%", "Windows": "12%" },
    referrerBreakdown: { "Google Search": "48%", "Direct URL": "26%", "WhatsApp": "16%", "Instagram/LinkedIn": "10%" },
    peakHours: "09:00 - 12:00 & 19:00 - 21:00"
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
    liveUrl: "http://localhost:5173/tentang-kami",
    browserBreakdown: { Chrome: "54%", Safari: "32%", Edge: "9%", Firefox: "5%" },
    deviceBreakdown: { "Desktop Mac/Win": "52%", "Mobile Smartphone": "44%", "Tablet": "4%" },
    referrerBreakdown: { "Direct URL": "42%", "Google Search": "36%", "WhatsApp Share": "14%", "Lainnya": "8%" },
    peakHours: "10:30 - 15:00"
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
    liveUrl: "http://localhost:5173/berita-artikel",
    browserBreakdown: { Chrome: "62%", Safari: "26%", Firefox: "7%", Edge: "5%" },
    deviceBreakdown: { "Mobile Smartphone": "74%", "Desktop": "22%", "Tablet": "4%" },
    referrerBreakdown: { "LinkedIn HR Post": "38%", "Google Search": "32%", "WhatsApp": "20%", "Direct": "10%" },
    peakHours: "13:00 - 16:00 & 20:00 - 22:00"
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
    liveUrl: "http://localhost:5173/hubungi-kami",
    browserBreakdown: { Chrome: "60%", Safari: "30%", Edge: "6%", Firefox: "4%" },
    deviceBreakdown: { "Mobile Smartphone": "62%", "Desktop": "35%", "Tablet": "3%" },
    referrerBreakdown: { "Google Search": "35%", "WhatsApp Share": "30%", "Banner CTA": "25%", "Direct": "10%" },
    peakHours: "08:30 - 11:30 & 14:00 - 17:00"
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
    liveUrl: "http://localhost:5173/berita-artikel",
    browserBreakdown: { Chrome: "65%", Safari: "25%", Edge: "6%", Firefox: "4%" },
    deviceBreakdown: { "Mobile Smartphone": "80%", "Desktop": "18%", "Tablet": "2%" },
    referrerBreakdown: { "LinkedIn Share": "60%", "Google Search": "25%", "WhatsApp": "15%" },
    peakHours: "12:00 - 14:00"
  }
];

const SAMPLE_SECTIONS_TODAY = {
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
        status: "100% Terpapar",
        deviceShare: "Mobile 68% • Desktop 32%",
        avgDurationSec: "28 detik",
        peakReachTime: "Pagi & Siang Hari"
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
        status: "Sangat Populer",
        deviceShare: "Mobile 70% • Desktop 30%",
        avgDurationSec: "44 detik",
        peakReachTime: "Siang Hari"
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
        status: "Optimal",
        deviceShare: "Mobile 65% • Desktop 35%",
        avgDurationSec: "38 detik",
        peakReachTime: "Sore Hari"
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
        status: "Konversi Tinggi",
        deviceShare: "Mobile 66% • Desktop 34%",
        avgDurationSec: "30 detik",
        peakReachTime: "Malam Hari"
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
        status: "Tuntas Dibaca",
        deviceShare: "Mobile 60% • Desktop 40%",
        avgDurationSec: "20 detik",
        peakReachTime: "Malam Hari"
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
        status: "100% Terpapar",
        deviceShare: "Mobile 54% • Desktop 46%",
        avgDurationSec: "25 detik",
        peakReachTime: "Siang Hari"
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
        status: "Sangat Populer",
        deviceShare: "Mobile 56% • Desktop 44%",
        avgDurationSec: "52 detik",
        peakReachTime: "Siang Hari"
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
        status: "Optimal",
        deviceShare: "Mobile 50% • Desktop 50%",
        avgDurationSec: "35 detik",
        peakReachTime: "Sore Hari"
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
        status: "Konversi Tinggi",
        deviceShare: "Mobile 58% • Desktop 42%",
        avgDurationSec: "28 detik",
        peakReachTime: "Sore Hari"
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
        status: "Tuntas Dibaca",
        deviceShare: "Mobile 52% • Desktop 48%",
        avgDurationSec: "18 detik",
        peakReachTime: "Malam Hari"
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
        status: "100% Terpapar",
        deviceShare: "Mobile 76% • Desktop 24%",
        avgDurationSec: "22 detik",
        peakReachTime: "Siang Hari"
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
        status: "Sangat Populer",
        deviceShare: "Mobile 75% • Desktop 25%",
        avgDurationSec: "48 detik",
        peakReachTime: "Sore Hari"
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
        status: "Optimal",
        deviceShare: "Mobile 72% • Desktop 28%",
        avgDurationSec: "40 detik",
        peakReachTime: "Malam Hari"
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
        status: "Tuntas Dibaca",
        deviceShare: "Mobile 70% • Desktop 30%",
        avgDurationSec: "15 detik",
        peakReachTime: "Malam Hari"
      }
    ]
  }
};

const SAMPLE_BUTTONS_TODAY = [
  {
    id: "btn_hero_trial",
    name: "Coba Sekarang / Daftar",
    pageLocation: "Beranda - Hero Banner Atas",
    actionType: "Link ke /hubungi-kami",
    totalClicks: 284,
    uniqueClickers: 242,
    ctr: "20.0%",
    performance: "Sangat Tinggi",
    colorBadge: "emerald",
    deviceClicks: { Mobile: "76%", Desktop: "24%" },
    browserClicks: { Chrome: "62%", Safari: "28%", Edge: "10%" },
    topHour: "11:00 - 13:00 (Jam Istirahat Kantor)"
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
    colorBadge: "emerald",
    deviceClicks: { Mobile: "88%", Desktop: "12%" },
    browserClicks: { Chrome: "64%", Safari: "30%", Edge: "6%" },
    topHour: "09:00 - 11:00 & 14:00 - 16:30"
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
    colorBadge: "blue",
    deviceClicks: { Mobile: "54%", Desktop: "46%" },
    browserClicks: { Chrome: "58%", Safari: "30%", Edge: "12%" },
    topHour: "10:00 - 12:00"
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
    colorBadge: "blue",
    deviceClicks: { Mobile: "52%", Desktop: "48%" },
    browserClicks: { Chrome: "60%", Safari: "25%", Edge: "15%" },
    topHour: "14:00 - 17:00"
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
    colorBadge: "amber",
    deviceClicks: { Mobile: "82%", Desktop: "18%" },
    browserClicks: { Chrome: "68%", Safari: "24%", Edge: "8%" },
    topHour: "19:00 - 21:00"
  }
];

// 4. Data Awal Arsip Draft Harian (Tersimpan dari jam 12 malam sebelumnya)
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
    topPage: "Beranda Utama (1.420 views)",
    topButton: "Coba Sekarang / Daftar (284 klik)",
    pages: SAMPLE_PAGES_TODAY,
    sections: SAMPLE_SECTIONS_TODAY["/"],
    buttons: SAMPLE_BUTTONS_TODAY
  },
  {
    id: "draft_2026_09_23",
    dateKey: "2026-09-23",
    dayLabel: "Rabu, 23 September 2026",
    archivedAt: "23 Sep 2026, 23:59:59 (Reset Jam 12 Malam)",
    totalViews: 2890,
    uniqueVisitors: 1980,
    avgScrollDepth: "68.2%",
    totalClicks: 760,
    topPage: "Beranda Utama (1.310 views)",
    topButton: "Konsultasi WhatsApp CS (245 klik)",
    pages: SAMPLE_PAGES_TODAY.map(p => ({ ...p, views: Math.round(p.views * 0.92) })),
    sections: SAMPLE_SECTIONS_TODAY["/"],
    buttons: SAMPLE_BUTTONS_TODAY.map(b => ({ ...b, totalClicks: Math.round(b.totalClicks * 0.9) }))
  },
  {
    id: "draft_2026_09_22",
    dateKey: "2026-09-22",
    dayLabel: "Selasa, 22 September 2026",
    archivedAt: "22 Sep 2026, 23:59:59 (Reset Jam 12 Malam)",
    totalViews: 2450,
    uniqueVisitors: 1720,
    avgScrollDepth: "65.0%",
    totalClicks: 640,
    topPage: "Tentang Kami (920 views)",
    topButton: "Coba Sekarang / Daftar (210 klik)",
    pages: SAMPLE_PAGES_TODAY.map(p => ({ ...p, views: Math.round(p.views * 0.8) })),
    sections: SAMPLE_SECTIONS_TODAY["/"],
    buttons: SAMPLE_BUTTONS_TODAY.map(b => ({ ...b, totalClicks: Math.round(b.totalClicks * 0.78) }))
  },
  {
    id: "draft_2026_09_21",
    dateKey: "2026-09-21",
    dayLabel: "Senin, 21 September 2026",
    archivedAt: "21 Sep 2026, 23:59:59 (Reset Jam 12 Malam)",
    totalViews: 2120,
    uniqueVisitors: 1480,
    avgScrollDepth: "62.5%",
    totalClicks: 590,
    topPage: "Beranda Utama (1.050 views)",
    topButton: "Konsultasi WhatsApp CS (180 klik)",
    pages: SAMPLE_PAGES_TODAY.map(p => ({ ...p, views: Math.round(p.views * 0.7) })),
    sections: SAMPLE_SECTIONS_TODAY["/"],
    buttons: SAMPLE_BUTTONS_TODAY.map(b => ({ ...b, totalClicks: Math.round(b.totalClicks * 0.7) }))
  }
];

export default function UserTracking() {
  const location = useLocation();
  const { submenu } = useParams();

  // Mode aktif: overview, pages, sections, buttons, drafts
  const activeMode = useMemo(() => {
    if (submenu === "pages" || location.pathname === "/tracking/pages") return "pages";
    if (submenu === "sections" || location.pathname === "/tracking/sections") return "sections";
    if (submenu === "buttons" || location.pathname === "/tracking/buttons") return "buttons";
    if (submenu === "drafts" || location.pathname === "/tracking/drafts") return "drafts";
    return "overview";
  }, [submenu, location.pathname]);

  // State Data Hari Berjalan (Apakah kosong atau berisi)
  // Sesuai permintaan user: "setelah jadi tolong apus dulu aj chat datanya ntar aj biar kelihatan"
  // Default isDataEmpty = true (kosong dulu)
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [liveCounterHits, setLiveCounterHits] = useState(0);

  // State Arsip Draft
  const [draftsList, setDraftsList] = useState(() => {
    try {
      const stored = localStorage.getItem("ayo_kasbon_drafts_archive");
      return stored ? JSON.parse(stored) : INITIAL_DRAFTS_ARCHIVE;
    } catch (e) {
      return INITIAL_DRAFTS_ARCHIVE;
    }
  });

  // State Modal Detail
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [detailModalType, setDetailModalType] = useState(null); // "page", "section", "button", "draft_view"
  const [selectedDraftView, setSelectedDraftView] = useState(null);

  // State Filter & Search
  const [selectedSectionPage, setSelectedSectionPage] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // 1. Data Halaman Hari Ini (Kosong atau Berisi)
  const pagesList = useMemo(() => {
    if (isDataEmpty) {
      if (liveCounterHits > 0) {
        return SAMPLE_PAGES_TODAY.map((p, idx) => ({
          ...p,
          views: idx === 0 ? liveCounterHits : 0,
          uniqueVisitors: idx === 0 ? 1 : 0,
          share: idx === 0 ? 100 : 0
        }));
      }
      return SAMPLE_PAGES_TODAY.map((p) => ({
        ...p,
        views: 0,
        uniqueVisitors: 0,
        share: 0,
        avgDuration: "0m 00s",
        bounceRate: "0%"
      }));
    }
    return SAMPLE_PAGES_TODAY.filter((p) => 
      !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [isDataEmpty, liveCounterHits, searchQuery]);

  // 2. Data Section Hari Ini
  const currentSectionData = useMemo(() => {
    const raw = SAMPLE_SECTIONS_TODAY[selectedSectionPage] || SAMPLE_SECTIONS_TODAY["/"];
    if (isDataEmpty) {
      if (liveCounterHits > 0) {
        return {
          ...raw,
          totalVisits: liveCounterHits,
          avgScrollDepth: "35.0%",
          sections: raw.sections.map((s, idx) => ({
            ...s,
            reachedCount: idx <= 1 ? liveCounterHits : 0,
            reachedPct: idx <= 1 ? 100 : 0
          }))
        };
      }
      return {
        ...raw,
        totalVisits: 0,
        avgScrollDepth: "0%",
        sections: raw.sections.map((s) => ({
          ...s,
          reachedCount: 0,
          reachedPct: 0
        }))
      };
    }
    return raw;
  }, [selectedSectionPage, isDataEmpty, liveCounterHits]);

  // 3. Data Tombol Hari Ini
  const buttonsList = useMemo(() => {
    if (isDataEmpty) {
      if (liveCounterHits > 0) {
        return SAMPLE_BUTTONS_TODAY.map((b, idx) => ({
          ...b,
          totalClicks: idx === 0 ? liveCounterHits : 0,
          uniqueClickers: idx === 0 ? 1 : 0,
          ctr: idx === 0 ? "100%" : "0%"
        }));
      }
      return SAMPLE_BUTTONS_TODAY.map((b) => ({
        ...b,
        totalClicks: 0,
        uniqueClickers: 0,
        ctr: "0%"
      }));
    }
    return SAMPLE_BUTTONS_TODAY.filter((b) => 
      !searchQuery.trim() || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.pageLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [isDataEmpty, liveCounterHits, searchQuery]);

  // Summary Metrics Hari Ini
  const todaySummary = useMemo(() => {
    if (isDataEmpty) {
      return {
        totalViews: liveCounterHits,
        totalClicks: liveCounterHits > 0 ? 1 : 0,
        avgScroll: liveCounterHits > 0 ? "35.0%" : "0%"
      };
    }
    return {
      totalViews: 3140,
      totalClicks: 827,
      avgScroll: "71.4%"
    };
  }, [isDataEmpty, liveCounterHits]);

  // AKSI 1: Simulasi Reset Jam 12 Malam (Arsipkan ke Draft & Reset Kosong)
  const handleMidnightReset = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const dateKey = today.toISOString().slice(0, 10);

    const newArchivedDraft = {
      id: "draft_" + Date.now(),
      dateKey,
      dayLabel: dateStr,
      archivedAt: `${dateStr}, 23:59:59 (Reset Otomatis 24 Jam)`,
      totalViews: isDataEmpty ? (liveCounterHits || 240) : 3140,
      uniqueVisitors: isDataEmpty ? 180 : 2190,
      avgScrollDepth: isDataEmpty ? "64.0%" : "71.4%",
      totalClicks: isDataEmpty ? 45 : 827,
      topPage: "Beranda Utama (Home)",
      topButton: "Coba Sekarang / Daftar",
      pages: SAMPLE_PAGES_TODAY,
      sections: SAMPLE_SECTIONS_TODAY["/"],
      buttons: SAMPLE_BUTTONS_TODAY
    };

    const updated = [newArchivedDraft, ...draftsList];
    setDraftsList(updated);
    try {
      localStorage.setItem("ayo_kasbon_drafts_archive", JSON.stringify(updated));
    } catch (e) {}

    // Reset data hari ini jadi kosong
    setIsDataEmpty(true);
    setLiveCounterHits(0);
    showToast(`🌙 Pukul 00:00! Data hari ini berhasil diarsipkan ke menu Draft, dan tracker hari ini direset kosong (0).`);
  };

  // AKSI 2: Kosongkan Data Hari Ini (Mulai dari Nol)
  const handleClearTodayData = () => {
    setIsDataEmpty(true);
    setLiveCounterHits(0);
    showToast("🧹 Data hari berjalan berhasil dikosongkan (Mulai dari nol).");
  };

  // AKSI 3: Isi Ulang Sampel Data Hari Ini
  const handleLoadSampleToday = () => {
    setIsDataEmpty(false);
    showToast("📊 Data sampel hari ini berhasil dimuat untuk demonstrasi!");
  };

  // AKSI 4: Simulasi 1 Kunjungan Baru
  const handleSimulateHit = () => {
    setLiveCounterHits((prev) => prev + 1);
    showToast("🚀 +1 Pengunjung baru masuk ke Beranda via Smartphone (Data live bertambah)!");
  };

  // Buka Modal Detail
  const openDetailModal = (item, type) => {
    setSelectedDetailItem(item);
    setDetailModalType(type);
  };

  // Tutup Modal Detail
  const closeDetailModal = () => {
    setSelectedDetailItem(null);
    setDetailModalType(null);
    setSelectedDraftView(null);
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
            {activeMode === "drafts"
              ? "Koleksi arsip harian: setiap 24 jam pukul 00:00 tengah malam, data harian otomatis disimpan ke draft dan tracker aktif direset bersih."
              : "Klik pada baris atau kartu apa pun untuk melihat rincian detail browser, perangkat, referrer, dan waktu interaksi."}
          </p>
        </div>

        <div className="cms-header-actions">
          {/* Tombol Kosongkan / Isi Sampel */}
          {isDataEmpty ? (
            <button
              onClick={handleLoadSampleToday}
              className="btn-secondary-action"
              title="Isi sampel data untuk melihat grafik dan tabel terisi lengkap"
            >
              <BarChart3 size={16} className="text-blue" />
              <span>Isi Data Sampel</span>
            </button>
          ) : (
            <button
              onClick={handleClearTodayData}
              className="btn-secondary-action text-danger"
              title="Kosongkan data hari ini untuk melihat tampilan dari nol"
            >
              <Trash2 size={16} />
              <span>Kosongkan Hari Ini (0)</span>
            </button>
          )}

          {/* Tombol Simulasi 1 Hit Kunjungan */}
          <button
            onClick={handleSimulateHit}
            className="btn-secondary-action"
            title="Tambah 1 interaksi pengunjung live"
          >
            <Sparkles size={16} className="text-amber" />
            <span>+ Simulasi 1 Hit</span>
          </button>

          {/* Tombol Simulasi Reset Jam 12 Malam */}
          <button
            onClick={handleMidnightReset}
            className="btn-primary-action"
            style={{ background: "#4338ca" }}
            title="Simulasikan pergantian hari jam 12 malam: arsipkan data hari ini ke Draft & reset kosong"
          >
            <History size={16} />
            <span>Simulasi Reset Jam 12 Malam</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 KARTU NAVIGASI SUBMENU & RINGKASAN METRIK                               */}
      {/* ========================================================================= */}
      <div className="analytics-pillar-cards-4 mb-4">
        {/* Submenu 1: Track Halaman */}
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
          <div className="pillar-value">{todaySummary.totalViews.toLocaleString("id-ID")} <span className="pillar-unit">Views</span></div>
          <p className="pillar-desc">Frekuensi akses pengunjung ke setiap URL halaman</p>
        </Link>

        {/* Submenu 2: Track Section */}
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
          <div className="pillar-value">{todaySummary.avgScroll} <span className="pillar-unit">Kedalaman</span></div>
          <p className="pillar-desc">Deteksi scroll user dari Hero (0%) sampai Footer (100%)</p>
        </Link>

        {/* Submenu 3: Track Button */}
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
          <div className="pillar-value">{todaySummary.totalClicks.toLocaleString("id-ID")} <span className="pillar-unit">Klik</span></div>
          <p className="pillar-desc">Jumlah interaksi klik tombol WhatsApp & pendaftaran</p>
        </Link>

        {/* Submenu 4: Draft & Riwayat Harian */}
        <Link 
          to="/tracking/drafts"
          className={`pillar-card ${activeMode === "drafts" ? "active-pillar" : ""}`}
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
      {/* BREADCRUMB & STATUS BAR                                                  */}
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
            <span>1. Track Halaman</span>
          </Link>
          <Link
            to="/tracking/sections"
            className={`analytics-tab-btn ${activeMode === "sections" ? "active" : ""}`}
          >
            <Layers size={15} />
            <span>2. Track Section (Scroll)</span>
          </Link>
          <Link
            to="/tracking/buttons"
            className={`analytics-tab-btn ${activeMode === "buttons" ? "active" : ""}`}
          >
            <MousePointerClick size={15} />
            <span>3. Track Button (Klik)</span>
          </Link>
          <Link
            to="/tracking/drafts"
            className={`analytics-tab-btn ${activeMode === "drafts" ? "active" : ""}`}
          >
            <Archive size={15} />
            <span>4. Draft & Riwayat Harian</span>
          </Link>
        </div>

        <div className="analytics-live-pulse-badge ml-auto">
          <span className="live-dot-pulse"></span>
          <span>{isDataEmpty ? "Tracker Aktif (Data Hari Ini Bersih)" : "Trafik Hari Ini Aktif"}</span>
        </div>
      </div>

      {/* Banner Informasi Status Data Kosong */}
      {isDataEmpty && activeMode !== "drafts" && (
        <div className="empty-tracker-notice-box mb-4">
          <div className="notice-icon">
            <Info size={20} className="text-blue" />
          </div>
          <div className="notice-text">
            <strong>Data Hari Ini Sedang Bersih / Kosong (0)</strong>
            <p>
              Sesuai permintaan Anda, data hari ini dikosongkan terlebih dahulu. Anda bisa mencoba tombol <strong>+ Simulasi 1 Hit</strong> untuk melihat penambahan angka satu per satu, atau klik <strong>Isi Data Sampel</strong> untuk melihat grafiknya kembali. Riwayat data lengkap tersimpan di menu <strong>4. Draft & Riwayat Harian</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUBMENU TRACK HALAMAN (PAGE TRACKING)                                  */}
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
                  💡 <em>Klik pada baris halaman mana saja untuk membuka popup detail browser, perangkat & referrer</em>
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
                    <th>Halaman Website (Klik untuk Detail)</th>
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
                      title="Klik untuk melihat detail browser, perangkat & waktu kunjungan"
                    >
                      <td>
                        <div className="d-flex align-center gap-2">
                          <FileText size={16} className="text-blue flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-main d-block">{p.name}</span>
                            <span className="text-xs text-blue">🔍 Klik untuk lihat detail browser</span>
                          </div>
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
                        <div className="d-flex align-center gap-2" style={{ minWidth: "100px" }}>
                          <div className="page-progress-track flex-1">
                            <div className="page-progress-fill" style={{ width: `${p.share}%` }} />
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
      {/* 2. SUBMENU TRACK SECTION (SCROLL DEPTH FUNNEL)                             */}
      {/* ========================================================================= */}
      {(activeMode === "sections" || activeMode === "overview") && (
        <div className="tab-content-area mb-4">
          {/* Penjelasan Logika Scroll Sesuai Request User */}
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
                  💡 <em>Klik pada kartu section mana saja untuk melihat rincian pengguna mobile vs desktop & retensi durasi</em>
                </p>
              </div>
              <div className="badge-module-status active-green">Ambang Batas Terkalibrasi</div>
            </div>

            <div className="scroll-funnel-list">
              {currentSectionData.sections.map((sec, idx) => (
                <div 
                  key={sec.id} 
                  onClick={() => openDetailModal(sec, "section")}
                  className="funnel-step-card cursor-pointer hover-highlight-card"
                  title="Klik untuk membuka detail interaksi section ini"
                >
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
                      <span className="text-xs text-blue mt-1">🔍 Klik untuk rincian mobile vs desktop</span>
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
      {/* 3. SUBMENU TRACK BUTTON (CLICK EVENTS & CTA)                              */}
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
                    <th>Nama Tombol (Klik untuk Detail)</th>
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
                      title="Klik untuk melihat breakdown perangkat & jam interaksi tombol ini"
                    >
                      <td>
                        <div className="d-flex align-center gap-2">
                          <div className={`btn-click-icon ${btn.colorBadge}`}>
                            <MousePointerClick size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-main d-block">{btn.name}</span>
                            <span className="text-xs text-blue">🔍 Klik untuk lihat browser pengklik</span>
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

      {/* ========================================================================= */}
      {/* 4. SUBMENU DRAFT & RIWAYAT HARIAN (RESET 24 JAM)                           */}
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
              <div className="d-flex align-center gap-2">
                <button
                  onClick={handleMidnightReset}
                  className="btn-primary-action"
                  title="Simulasikan pergantian hari jam 12 malam sekarang"
                >
                  <History size={15} />
                  <span>Simulasi Reset Jam 12 Malam</span>
                </button>
              </div>
            </div>

            {/* List Arsip Draft per Hari */}
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

                    <button 
                      type="button" 
                      className="btn-view-draft"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(draft, "draft_view");
                      }}
                    >
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
      {/* MODAL POPUP DETAIL (BROWSER, DEVICE, REFERRER & RIWAYAT)                 */}
      {/* ========================================================================= */}
      {selectedDetailItem && (
        <div className="analytics-modal-backdrop" onClick={closeDetailModal}>
          <div className="analytics-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="modal-header">
              <div className="d-flex align-center gap-2">
                {detailModalType === "page" && <FileText size={22} className="text-blue" />}
                {detailModalType === "section" && <Layers size={22} className="text-purple" />}
                {detailModalType === "button" && <MousePointerClick size={22} className="text-emerald" />}
                {detailModalType === "draft_view" && <Archive size={22} className="text-amber" />}
                <div>
                  <h3 className="modal-title">
                    {detailModalType === "page" && `Detail Kunjungan: ${selectedDetailItem.name}`}
                    {detailModalType === "section" && `Detail Scroll: ${selectedDetailItem.name}`}
                    {detailModalType === "button" && `Detail Interaksi: ${selectedDetailItem.name}`}
                    {detailModalType === "draft_view" && `Laporan Lengkap: ${selectedDetailItem.dayLabel}`}
                  </h3>
                  <span className="modal-subtitle">
                    {detailModalType === "page" && `Path: ${selectedDetailItem.path} • Total ${selectedDetailItem.views} Tayangan`}
                    {detailModalType === "section" && `Posisi ${selectedDetailItem.positionPct} • ${selectedDetailItem.reachedCount} Pengunjung Mencapai`}
                    {detailModalType === "button" && `Lokasi: ${selectedDetailItem.pageLocation} • Total ${selectedDetailItem.totalClicks} Klik`}
                    {detailModalType === "draft_view" && selectedDetailItem.archivedAt}
                  </span>
                </div>
              </div>

              <button onClick={closeDetailModal} className="modal-btn-close" aria-label="Tutup">
                <X size={20} />
              </button>
            </div>

            {/* Content Modal Berdasarkan Tipe */}
            <div className="modal-body">
              {/* TIPE 1: DETAIL HALAMAN (BROWSER & DEVICE BREAKDOWN) */}
              {detailModalType === "page" && (
                <div className="modal-detail-grid">
                  {/* Card 1: Browser Breakdown */}
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Globe size={16} className="text-emerald" />
                      <span>Rincian Peramban (Browser)</span>
                    </h4>
                    <div className="breakdown-stat-rows">
                      {selectedDetailItem.browserBreakdown && Object.entries(selectedDetailItem.browserBreakdown).map(([browser, pct]) => (
                        <div key={browser} className="breakdown-stat-row">
                          <span className="stat-name">{browser}</span>
                          <div className="stat-bar-track">
                            <div className="stat-bar-fill green" style={{ width: pct }}></div>
                          </div>
                          <span className="stat-val">{pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Perangkat & OS Breakdown */}
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Smartphone size={16} className="text-blue" />
                      <span>Rincian Perangkat & Sistem Operasi</span>
                    </h4>
                    <div className="breakdown-stat-rows">
                      {selectedDetailItem.deviceBreakdown && Object.entries(selectedDetailItem.deviceBreakdown).map(([device, pct]) => (
                        <div key={device} className="breakdown-stat-row">
                          <span className="stat-name">{device}</span>
                          <div className="stat-bar-track">
                            <div className="stat-bar-fill blue" style={{ width: pct }}></div>
                          </div>
                          <span className="stat-val">{pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Sumber Rujukan (Referrer) */}
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Share2 size={16} className="text-purple" />
                      <span>Saluran Rujukan (Referrer)</span>
                    </h4>
                    <div className="breakdown-stat-rows">
                      {selectedDetailItem.referrerBreakdown && Object.entries(selectedDetailItem.referrerBreakdown).map(([ref, pct]) => (
                        <div key={ref} className="breakdown-stat-row">
                          <span className="stat-name">{ref}</span>
                          <div className="stat-bar-track">
                            <div className="stat-bar-fill purple" style={{ width: pct }}></div>
                          </div>
                          <span className="stat-val">{pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 4: Waktu Puncak Kunjungan */}
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Clock size={16} className="text-amber" />
                      <span>Waktu & Jam Tersibuk</span>
                    </h4>
                    <div className="peak-hours-box">
                      <div className="peak-hour-badge">{selectedDetailItem.peakHours || "09:00 - 15:00"}</div>
                      <p className="text-sm text-secondary mt-2">
                        Pengunjung paling aktif membaca halaman ini saat jam istirahat kantor dan malam hari.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TIPE 2: DETAIL SECTION (SCROLL DEPTH) */}
              {detailModalType === "section" && (
                <div className="modal-detail-grid">
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <TrendingUp size={16} className="text-blue" />
                      <span>Retensi Pembaca di Section Ini</span>
                    </h4>
                    <div className="metric-large-text">{selectedDetailItem.reachedPct}%</div>
                    <p className="text-sm text-secondary">
                      Dari total pengunjung, sebanyak <strong>{selectedDetailItem.reachedCount} orang</strong> berhasil scroll dan melihat konten section ini.
                    </p>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Smartphone size={16} className="text-purple" />
                      <span>Proporsi Perangkat yang Mencapai</span>
                    </h4>
                    <div className="metric-large-text font-medium text-lg">{selectedDetailItem.deviceShare || "Mobile 68% • Desktop 32%"}</div>
                    <p className="text-sm text-secondary mt-2">
                      Pengguna smartphone memiliki rasio scroll yang konsisten hingga melewati ambang batas threshold section ini.
                    </p>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Clock size={16} className="text-emerald" />
                      <span>Rata-rata Durasi Pandangan</span>
                    </h4>
                    <div className="metric-large-text font-bold text-emerald">{selectedDetailItem.avgDurationSec || "35 detik"}</div>
                    <p className="text-sm text-secondary mt-1">
                      Waktu rata-rata yang dihabiskan pengunjung untuk membaca materi di section ini.
                    </p>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Flame size={16} className="text-amber" />
                      <span>Tingkat Drop-Off Setelah Section Ini</span>
                    </h4>
                    <div className="metric-large-text font-bold text-amber">{selectedDetailItem.dropOffRate || "15%"}</div>
                    <p className="text-sm text-secondary mt-1">
                      Persentase pengunjung yang berhenti scroll atau keluar halaman setelah melewati section ini.
                    </p>
                  </div>
                </div>
              )}

              {/* TIPE 3: DETAIL TOMBOL (BUTTON CLICKS) */}
              {detailModalType === "button" && (
                <div className="modal-detail-grid">
                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <MousePointerClick size={16} className="text-emerald" />
                      <span>Statistik Klik & Rasio Konversi</span>
                    </h4>
                    <div className="metric-large-text">{selectedDetailItem.totalClicks} <span className="text-sm font-normal text-secondary">Klik Total</span></div>
                    <p className="text-sm text-secondary">
                      Dihasilkan oleh <strong>{selectedDetailItem.uniqueClickers} pengguna unik</strong> dengan CTR rata-rata <strong>{selectedDetailItem.ctr}</strong>.
                    </p>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Smartphone size={16} className="text-blue" />
                      <span>Perangkat Pengklik</span>
                    </h4>
                    <div className="breakdown-stat-rows">
                      {selectedDetailItem.deviceClicks && Object.entries(selectedDetailItem.deviceClicks).map(([dev, pct]) => (
                        <div key={dev} className="breakdown-stat-row">
                          <span className="stat-name">{dev}</span>
                          <div className="stat-bar-track">
                            <div className="stat-bar-fill blue" style={{ width: pct }}></div>
                          </div>
                          <span className="stat-val">{pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Globe size={16} className="text-purple" />
                      <span>Peramban (Browser) Pengklik</span>
                    </h4>
                    <div className="breakdown-stat-rows">
                      {selectedDetailItem.browserClicks && Object.entries(selectedDetailItem.browserClicks).map(([br, pct]) => (
                        <div key={br} className="breakdown-stat-row">
                          <span className="stat-name">{br}</span>
                          <div className="stat-bar-track">
                            <div className="stat-bar-fill purple" style={{ width: pct }}></div>
                          </div>
                          <span className="stat-val">{pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-info-card">
                    <h4 className="info-card-heading">
                      <Clock size={16} className="text-amber" />
                      <span>Waktu Terbanyak Tombol Diklik</span>
                    </h4>
                    <div className="peak-hours-box">
                      <div className="peak-hour-badge">{selectedDetailItem.topHour || "12:00 - 14:00"}</div>
                      <p className="text-sm text-secondary mt-2">
                        Paling banyak diklik karyawan saat jam istirahat makan siang.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TIPE 4: DETAIL ARSIP DRAFT HARIAN */}
              {detailModalType === "draft_view" && (
                <div>
                  <div className="draft-view-summary-grid mb-4">
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Total Views Hari Itu</span>
                      <strong className="kpi-num">{selectedDetailItem.totalViews.toLocaleString("id-ID")}</strong>
                    </div>
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Pengunjung Unik</span>
                      <strong className="kpi-num">{selectedDetailItem.uniqueVisitors.toLocaleString("id-ID")}</strong>
                    </div>
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Rata-rata Scroll</span>
                      <strong className="kpi-num">{selectedDetailItem.avgScrollDepth}</strong>
                    </div>
                    <div className="draft-kpi-box">
                      <span className="kpi-title">Total Klik Tombol</span>
                      <strong className="kpi-num">{selectedDetailItem.totalClicks.toLocaleString("id-ID")}</strong>
                    </div>
                  </div>

                  <h4 className="font-bold text-main mb-2">Rekap Kunjungan Halaman pada {selectedDetailItem.dayLabel}:</h4>
                  <div className="cms-table-responsive mb-4">
                    <table className="cms-table">
                      <thead>
                        <tr>
                          <th>Halaman</th>
                          <th>Path</th>
                          <th>Views</th>
                          <th>Unique</th>
                          <th>Perangkat Dominan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDetailItem.pages.map((p) => (
                          <tr key={p.id}>
                            <td className="font-semibold text-main">{p.name}</td>
                            <td><code>{p.path}</code></td>
                            <td className="font-bold">{p.views}</td>
                            <td>{p.uniqueVisitors} org</td>
                            <td><span className="badge-tag-browser">{p.topDevice}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className="font-bold text-main mb-2">Rekap Klik Tombol CTA pada {selectedDetailItem.dayLabel}:</h4>
                  <div className="cms-table-responsive">
                    <table className="cms-table">
                      <thead>
                        <tr>
                          <th>Tombol</th>
                          <th>Lokasi</th>
                          <th>Total Klik</th>
                          <th>CTR</th>
                          <th>Performa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDetailItem.buttons.map((b) => (
                          <tr key={b.id}>
                            <td className="font-bold text-main">{b.name}</td>
                            <td>{b.pageLocation}</td>
                            <td className="font-extrabold">{b.totalClicks}</td>
                            <td><span className="badge-ctr">{b.ctr}</span></td>
                            <td><span className="badge-performance optimal">{b.performance}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
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
