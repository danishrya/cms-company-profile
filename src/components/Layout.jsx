import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  UserCheck
} from "lucide-react";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout", err);
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Kelola Artikel", path: "/articles", icon: FileText },
    { label: "Tulis Artikel Baru", path: "/articles/new", icon: PlusCircle },
  ];

  return (
    <div className="cms-app-wrapper">
      {/* Sidebar Desktop */}
      <aside className={`cms-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <img src={logo} alt="Ayo Kasbon" className="sidebar-logo" />
          <div className="sidebar-brand-badge">CMS ADMIN</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-title">MENU UTAMA</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={19} className="nav-item-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

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
            <h2 className="topbar-title">Panel Pengelola Artikel Ayo Kasbon</h2>
          </div>

          <div className="topbar-actions">
            <a 
              href="http://localhost:5173/berita-artikel" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-preview-live"
            >
              <ExternalLink size={15} />
              <span>Lihat Web Live</span>
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
