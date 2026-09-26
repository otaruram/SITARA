import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import CompleteProfile from './pages/CompleteProfile';
import DashboardWarga from './pages/DashboardWarga';
import DashboardRT from './pages/DashboardRT';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem('role');
  if (!role) return <Navigate to="/auth" />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'rt' ? '/rt' : '/warga'} />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="auth" element={<Auth />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="complete-profile" element={<CompleteProfile />} />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="warga" 
            element={
              <ProtectedRoute allowedRole="warga">
                <DashboardWarga />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="rt" 
            element={
              <ProtectedRoute allowedRole="rt">
                <DashboardRT />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
