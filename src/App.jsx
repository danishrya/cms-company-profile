import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArticlesList from "./pages/ArticlesList";
import ArticleEditor from "./pages/ArticleEditor";
import ArticleHeroManager from "./pages/ArticleHeroManager";
import AboutManager from "./pages/AboutManager";
import HomeManager from "./pages/HomeManager";
import ContactManager from "./pages/ContactManager";
import UserTracking from "./pages/UserTracking";
import "./App.css";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 1. Berita & Artikel Routes */}
          <Route
            path="/articles/hero"
            element={
              <ProtectedRoute>
                <Layout>
                  <ArticleHeroManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <Layout>
                  <ArticlesList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/articles/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <ArticleEditor />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/articles/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ArticleEditor />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 2. Tentang Kami (About) Routes */}
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Layout>
                  <AboutManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about/:section"
            element={
              <ProtectedRoute>
                <Layout>
                  <AboutManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 3. Hubungi Kami (Contact) Routes */}
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Layout>
                  <ContactManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact/:section"
            element={
              <ProtectedRoute>
                <Layout>
                  <ContactManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 4. Beranda (Home) Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/:section"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeManager />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 5. Pelacakan Pengunjung & Trafik (User Tracking) */}
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserTracking />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/:submenu"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserTracking />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}
