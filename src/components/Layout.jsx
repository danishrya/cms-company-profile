import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  LayoutDashboard,
  Home,
  Info,
  PhoneCall,
  FileText,
  Activity,
  LogOut,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  PlusCircle,
  Users,
  Sparkles,
  Building2,
  Layers,
  MessageSquareQuote,
  Award,
  Monitor,
  LayoutGrid,
  HeartHandshake,
  Gift,
  Video,
  ImageIcon,
  UserCheck
} from "lucide-react";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Accordion mode: saat dibuka pertama kali semua tertutup agar rapi (sesuai request user)
  const [openMenus, setOpenMenus] = useState({
    home: false,
    about: false,
    contact: false,
    articles: false,
    tracking: false,
  });

  // Listener real-time untuk jumlah pesan masuk unread
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const colRef = collection(db, "contact_messages");
      unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const count = snapshot.docs.filter((d) => d.data()?.status !== "replied").length;
            setUnreadMessagesCount(count);
          } else {
            setUnreadMessagesCount(0);
          }
        },
        () => setUnreadMessagesCount(0)
      );
    } catch {
      setUnreadMessagesCount(0);
    }
    return () => unsubscribe();
  }, []);

  // Lock body scroll saat mobile drawer terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Tutup menu saat menekan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Toggle accordion: satu menu terbuka akan menutup menu lainnya agar rapi dan tidak ramai
  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => {
      const willOpen = !prev[menuKey];
      if (willOpen) {
        return {
          home: false,
          about: false,
          contact: false,
          articles: false,
          tracking: false,
          [menuKey]: true,
        };
      }
      return {
        ...prev,
        [menuKey]: false,
      };
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout", err);
    }
  };

  // Konfigurasi Navigasi Bersih & Rapi (Tanpa badge berulang yang bikin ramai)
  const menuGroups = [
    {
      id: "home",
      title: "Halaman Beranda",
      icon: Home,
      rootPath: "/home",
      submenus: [
        { label: "1. Hero Banner", path: "/home/hero", icon: Sparkles },
        { label: "2. Mitra & Partner", path: "/home/partnership", icon: Building2 },
        { label: "3. Layanan & Fitur", path: "/home/features", icon: Layers },
        { label: "4. Kutipan & Visi", path: "/home/quote", icon: MessageSquareQuote },
        { label: "5. Nilai Lebih", path: "/home/value", icon: Award },
        { label: "6. Pantau Transaksi", path: "/home/monitor", icon: Monitor },
        { label: "7. Keuntungan Lain", path: "/home/otherBenefits", icon: LayoutGrid },
        { label: "8. Testimoni Karyawan", path: "/home/testimonials", icon: HeartHandshake },
        { label: "9. Banner Trial (CTA)", path: "/home/cta", icon: Gift },
        { label: "10. Panduan Video", path: "/home/videoGuide", icon: Video },
      ],
    },
    {
      id: "about",
      title: "Tentang Kami",
      icon: Users,
      rootPath: "/about",
      submenus: [
        { label: "1. Hero Profil & Visi", path: "/about/hero", icon: Sparkles },
        { label: "2. Sejarah & Foto Tim", path: "/about/history", icon: ImageIcon },
        { label: "3. Kenapa Ayo Kasbon", path: "/about/why", icon: Layers },
        { label: "4. Banner Konsultasi CS", path: "/about/consultation", icon: PhoneCall },
      ],
    },
    {
      id: "contact",
      title: "Hubungi Kami",
      icon: PhoneCall,
      unreadBadge: unreadMessagesCount,
      rootPath: "/contact",
      submenus: [
        { label: "1. Hero & Kolaborasi", path: "/contact/hero", icon: Sparkles },
        { label: "2. Info Kontak Resmi", path: "/contact/info", icon: PhoneCall },
        { 
          label: "3. Kotak Masuk Pesan", 
          path: "/contact/messages", 
          icon: MessageSquareQuote, 
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : null 
        },
      ],
    },
    {
      id: "articles",
      title: "Berita & Artikel",
      icon: FileText,
      rootPath: "/articles",
      submenus: [
        { label: "1. Header Hero Edukasi", path: "/articles/hero", icon: Sparkles },
        { label: "2. Daftar Semua Artikel", path: "/articles", icon: FileText },
        { label: "3. Tulis Artikel Baru", path: "/articles/new", icon: PlusCircle },
      ],
    },
  ];

  // Penentuan Judul Topbar & Link Web Live yang Relevan
  let topbarTitle = "CMS Panel Ayo Kasbon";
  let livePreviewUrl = "http://localhost:5175/";
  let livePreviewText = "Preview Web";

  if (location.pathname === "/articles/hero") {
    topbarTitle = "Header Hero Edukasi";
    livePreviewUrl = "http://localhost:5175/berita-artikel";
    livePreviewText = "Preview Artikel";
  } else if (location.pathname.startsWith("/articles")) {
    topbarTitle = "Kelola Artikel & Berita";
    livePreviewUrl = "http://localhost:5175/berita-artikel";
    livePreviewText = "Preview Artikel";
  } else if (location.pathname.startsWith("/contact/messages")) {
    topbarTitle = "Kotak Masuk Pesan Form";
    livePreviewUrl = "http://localhost:5175/hubungi-kami";
    livePreviewText = "Preview Form";
  } else if (location.pathname.startsWith("/contact")) {
    topbarTitle = "Kelola Hubungi Kami";
    livePreviewUrl = "http://localhost:5175/hubungi-kami";
    livePreviewText = "Preview Kontak";
  } else if (location.pathname === "/about/hero") {
    topbarTitle = "Hero Profil Tentang Kami";
    livePreviewUrl = "http://localhost:5175/tentang-kami";
    livePreviewText = "Preview Tentang";
  } else if (location.pathname.startsWith("/about")) {
    topbarTitle = "Kelola Tentang Kami";
    livePreviewUrl = "http://localhost:5175/tentang-kami";
    livePreviewText = "Preview Tentang";
  } else if (location.pathname.startsWith("/home")) {
    topbarTitle = "Kelola Beranda Utama";
    livePreviewUrl = "http://localhost:5175/";
    livePreviewText = "Preview Beranda";
  } else if (location.pathname === "/tracking/pages") {
    topbarTitle = "Pelacakan Halaman";
  } else if (location.pathname === "/tracking/sections") {
    topbarTitle = "Pelacakan Section Scroll";
  } else if (location.pathname === "/tracking/buttons") {
    topbarTitle = "Pelacakan Klik Tombol";
  } else if (location.pathname.startsWith("/tracking")) {
    topbarTitle = "Analitik Pengunjung Live";
  } else if (location.pathname === "/") {
    topbarTitle = "Dashboard CMS";
  }

  return (
    <div className="cms-app-wrapper">
      {/* Sidebar Navigasi Admin */}
      <aside className={`cms-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-left">
            <img src="/logo.png" alt="Ayo Kasbon" className="sidebar-logo" />
            <span className="sidebar-brand-badge">CMS</span>
          </div>
          <button 
            type="button" 
            className="sidebar-close-btn-mobile" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-title">NAVIGASI UTAMA</div>

          {/* Menu Dashboard Utama */}
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={18} className="nav-item-icon" />
            <span>Dashboard</span>
          </Link>

          <div className="nav-group-title mt-3">ANALITIK & MONITORING</div>

          {/* Accordion Track Pengunjung */}
          <div className="nav-group-accordion">
            <button
              type="button"
              onClick={() => toggleMenu("tracking")}
              className={`nav-accordion-header ${location.pathname.startsWith("/tracking") ? "parent-active" : ""}`}
              aria-expanded={openMenus.tracking}
            >
              <div className="nav-header-left">
                <Activity size={18} className="nav-item-icon" />
                <span className="nav-header-title">Track Pengunjung</span>
              </div>

              <div className="nav-header-right">
                <span className="nav-pulse-dot" title="Live Monitoring" />
                <ChevronDown
                  size={15}
                  className={`nav-chevron-icon ${openMenus.tracking ? "expanded" : ""}`}
                />
              </div>
            </button>

            {openMenus.tracking && (
              <div className="nav-submenu-list">
                <Link
                  to="/tracking"
                  className={`nav-submenu-link ${location.pathname === "/tracking" ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-submenu-bullet" />
                  <span className="nav-submenu-text">Ringkasan Analitik</span>
                </Link>

                <Link
                  to="/tracking/pages"
                  className={`nav-submenu-link ${location.pathname === "/tracking/pages" ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-submenu-bullet" />
                  <span className="nav-submenu-text">1. Track Halaman</span>
                </Link>

                <Link
                  to="/tracking/sections"
                  className={`nav-submenu-link ${location.pathname === "/tracking/sections" ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-submenu-bullet" />
                  <span className="nav-submenu-text">2. Track Section (Scroll)</span>
                </Link>

                <Link
                  to="/tracking/buttons"
                  className={`nav-submenu-link ${location.pathname === "/tracking/buttons" ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-submenu-bullet" />
                  <span className="nav-submenu-text">3. Track Button (Klik)</span>
                </Link>

                <Link
                  to="/tracking/drafts"
                  className={`nav-submenu-link ${location.pathname === "/tracking/drafts" ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-submenu-bullet" />
                  <span className="nav-submenu-text">4. Draft & Riwayat Harian</span>
                </Link>
              </div>
            )}
          </div>

          <div className="nav-group-title mt-3">KONTEN WEBSITE</div>

          {/* List Accordion Menu Groups Halaman */}
          {menuGroups.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openMenus[group.id];
            const isGroupActive = location.pathname.startsWith(group.rootPath);

            return (
              <div key={group.id} className="nav-group-accordion">
                <button
                  type="button"
                  onClick={() => toggleMenu(group.id)}
                  className={`nav-accordion-header ${isGroupActive ? "parent-active" : ""}`}
                  aria-expanded={isOpen}
                >
                  <div className="nav-header-left">
                    <GroupIcon size={18} className="nav-item-icon" />
                    <span className="nav-header-title">{group.title}</span>
                  </div>

                  <div className="nav-header-right">
                    {group.unreadBadge > 0 && (
                      <span className="nav-badge-unread" title={`${group.unreadBadge} pesan baru`}>
                        {group.unreadBadge}
                      </span>
                    )}
                    <ChevronDown
                      size={15}
                      className={`nav-chevron-icon ${isOpen ? "expanded" : ""}`}
                    />
                  </div>
                </button>

                {/* Submenu Dropdown */}
                {isOpen && (
                  <div className="nav-submenu-list">
                    {group.submenus.map((sub) => {
                      const isSubActive = 
                        location.pathname === sub.path ||
                        (sub.path === "/home/hero" && location.pathname === "/home") ||
                        (sub.path === "/about/hero" && location.pathname === "/about") ||
                        (sub.path === "/contact/hero" && location.pathname === "/contact") ||
                        (sub.path === "/articles" && location.pathname.startsWith("/articles/edit/"));

                      return (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`nav-submenu-link ${isSubActive ? "active" : ""}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="nav-submenu-bullet" />
                          <span className="nav-submenu-text">{sub.label}</span>
                          {sub.badge && (
                            <span className="nav-submenu-badge">{sub.badge}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              <UserCheck size={16} />
            </div>
            <div className="admin-user-info">
              <span className="admin-user-label">Admin Terverifikasi</span>
              <span className="admin-user-email" title={user?.email}>
                {user?.email || "admin@ayokasbon.id"}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-logout" title="Keluar dari CMS">
            <LogOut size={16} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="cms-main-container">
        {/* Topbar */}
        <header className="cms-topbar">
          <div className="topbar-left">
            <button 
              className="btn-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="topbar-title-box">
              <h2 className="topbar-title">{topbarTitle}</h2>
            </div>
          </div>

          <div className="topbar-actions">
            <a 
              href={livePreviewUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-preview-live"
              title="Buka tampilan website asli di tab baru"
            >
              <ExternalLink size={14} />
              <span className="btn-preview-text">{livePreviewText}</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="cms-page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
