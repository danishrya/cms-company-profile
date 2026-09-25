import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import { 
  Activity,
  BarChart3,
  MousePointerClick,
  LayoutDashboard, 
  Home,
  Info,
  FileText, 
  PlusCircle, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
  PhoneCall,
  Image as ImageIcon,
  MessageSquareQuote,
  Building2,
  Award,
  Monitor,
  LayoutGrid,
  HeartHandshake,
  Gift,
  Video
} from "lucide-react";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State untuk kontrol accordion buka/tutup (default semua tertutup saat baru dibuka agar rapi)
  const [openMenus, setOpenMenus] = useState({
    home: false,
    about: false,
    articles: false,
    tracking: false,
  });

  // Toggle menu: jika membuka satu menu, tutup menu lainnya (accordion mode) agar sidebar tetap ramping & rapi
  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => {
      const willOpen = !prev[menuKey];
      if (willOpen) {
        return {
          home: false,
          about: false,
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

  // Konfigurasi Navigasi Modular (Main Menu & Submenu)
  const menuGroups = [
    {
      id: "home",
      title: "Beranda (Home)",
      icon: Home,
      badge: "10 Section",
      badgeClass: "badge-success",
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
      title: "Tentang Kami (About)",
      icon: Info,
      badge: "Aktif",
      badgeClass: "badge-success",
      rootPath: "/about",
      submenus: [
        { label: "Sejarah & Foto Tim", path: "/about/history", icon: ImageIcon },
        { label: "Kenapa Ayo Kasbon (Cards)", path: "/about/why", icon: Layers },
        { label: "Banner Konsultasi CS", path: "/about/consultation", icon: PhoneCall },
      ],
    },
    {
      id: "articles",
      title: "Berita & Artikel",
      icon: FileText,
      badge: "Aktif",
      badgeClass: "badge-success",
      rootPath: "/articles",
      submenus: [
        { label: "Daftar Semua Artikel", path: "/articles", icon: FileText },
        { label: "Tulis Artikel Baru", path: "/articles/new", icon: PlusCircle },
      ],
    },
  ];

  // Penentuan Judul Topbar & Link Web Live yang Relevan
  let topbarTitle = "Panel Pengelola CMS Ayo Kasbon";
  let livePreviewUrl = "http://localhost:5175/";
  let livePreviewText = "Lihat Beranda";

  if (location.pathname.startsWith("/articles")) {
    topbarTitle = "Pengelola Berita & Artikel";
    livePreviewUrl = "http://localhost:5175/berita-artikel";
    livePreviewText = "Lihat Berita Live";
  } else if (location.pathname.startsWith("/about")) {
    topbarTitle = "Pengelola Halaman Tentang Kami";
    livePreviewUrl = "http://localhost:5175/tentang-kami";
    livePreviewText = "Lihat Tentang Kami";
  } else if (location.pathname.startsWith("/home")) {
    topbarTitle = "Pengelola Halaman Beranda";
    livePreviewUrl = "http://localhost:5175/";
    livePreviewText = "Lihat Beranda Live";
  } else if (location.pathname === "/tracking/pages") {
    topbarTitle = "1. Pelacakan Halaman (Page Tracking)";
  } else if (location.pathname === "/tracking/sections") {
    topbarTitle = "2. Pelacakan Kedalaman Scroll per Section";
  } else if (location.pathname === "/tracking/buttons") {
    topbarTitle = "3. Pelacakan Klik Tombol & Interaksi CTA";
  } else if (location.pathname.startsWith("/tracking")) {
    topbarTitle = "Ringkasan Pelacakan Trafik & Pengunjung";
  } else if (location.pathname === "/") {
    topbarTitle = "Dashboard Ringkasan CMS";
  }

  return (
    <div className="cms-app-wrapper">
      {/* Sidebar Desktop & Mobile */}
      <aside className={`cms-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <img src={logo} alt="Ayo Kasbon" className="sidebar-logo" />
          <div className="sidebar-brand-badge">CMS ADMIN</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-title">NAVIGASI UTAMA</div>
          
          {/* Dashboard Item Tunggal */}
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={18} className="nav-item-icon" />
            <span>Dashboard</span>
          </Link>

          <div className="nav-group-title mt-3">ANALITIK & MONITORING</div>

          {/* Accordion Track Pengunjung dengan 3 Submenu */}
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
                <span className="nav-badge-status badge-success">Live</span>
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



          <div className="nav-group-title mt-3">KONTEN WEBSITE (PAGES)</div>

          {/* List Accordion Menu Groups */}
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
                    {group.badge && (
                      <span className={`nav-badge-status ${group.badgeClass}`}>
                        {group.badge}
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
                      const SubIcon = sub.icon;
                      const isSubActive = 
                        location.pathname === sub.path ||
                        (sub.path === "/home/hero" && location.pathname === "/home") ||
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
              <UserCheck size={18} />
            </div>
            <div className="admin-user-info">
              <span className="admin-user-label">Admin Terverifikasi</span>
              <span className="admin-user-email" title={user?.email}>
                {user?.email || "admin@ayokasbon.id"}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-logout" title="Keluar dari CMS">
            <LogOut size={17} />
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
          <button 
            className="btn-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="topbar-title-box">
            <h2 className="topbar-title">{topbarTitle}</h2>
          </div>

          <div className="topbar-actions">
            <a 
              href={livePreviewUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-preview-live"
            >
              <ExternalLink size={15} />
              <span>{livePreviewText}</span>
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
