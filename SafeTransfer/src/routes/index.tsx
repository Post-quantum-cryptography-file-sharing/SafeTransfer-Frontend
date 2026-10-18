import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { LoginPage } from '@/pages/LoginPage';
import {RegisterPage} from "@/pages/RegisterPage.tsx";

const DashboardPage = () => <div>Dashboard</div>;
const MyFilesPage = () => <div>My Files</div>;
const SharedFilesPage = () => <div>Shared With Me</div>;
const UploadPage = () => <div>Upload Files</div>;
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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/files" element={<MyFilesPage />} />
        <Route path="/shared" element={<SharedFilesPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/batch/:id" element={<BatchDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
