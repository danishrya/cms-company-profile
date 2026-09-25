import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "#f8fafc",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
        }}>
          <div style={{
            maxWidth: "440px",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "28px 24px",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
            textAlign: "center"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#fef2f2",
              color: "#ef4444",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <AlertCircle size={26} />
            </div>

            <h2 style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "8px"
            }}>
              Terjadi Kendala Sementara
            </h2>

            <p style={{
              fontSize: "13.5px",
              color: "#64748b",
              lineHeight: 1.5,
              marginBottom: "20px"
            }}>
              Sistem berhasil mengamankan sesi admin. Silakan muat ulang untuk memperbarui data.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "11px 16px",
                borderRadius: "10px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                border: "none",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <RefreshCw size={15} />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
