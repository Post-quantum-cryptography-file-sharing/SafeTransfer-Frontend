import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/components/DashboardLayout';
import {MyFilesPage} from "@/pages/MyFilesPage.tsx";

const SharedFilesPage = () => <div>Shared With Me</div>;
const BatchDetailsPage = () => <div>Batch Details</div>;
const SettingsPage = () => <div>Settings</div>;

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/files" element={<MyFilesPage />} />
          <Route path="/shared" element={<SharedFilesPage />} />
          <Route path="/batch/:id" element={<BatchDetailsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/files" replace />} />
      <Route path="*" element={<Navigate to="/files" replace />} />
    </Routes>
  );
}
