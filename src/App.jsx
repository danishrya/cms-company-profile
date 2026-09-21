import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArticlesList from "./pages/ArticlesList";
import ArticleEditor from "./pages/ArticleEditor";
import AboutManager from "./pages/AboutManager";
import HomeManager from "./pages/HomeManager";
import "./App.css";

export default function App() {
  return (
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

        {/* 2. Tentang Kami (About) Routes - Tahap 2 */}
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

        {/* 3. Beranda (Home) Routes - Tahap 3 */}
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

        {/* Catch all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
