import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ArticlesList from "./pages/ArticlesList";
import ArticleEditor from "./pages/ArticleEditor";
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

        {/* Catch all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
