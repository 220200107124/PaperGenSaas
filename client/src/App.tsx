import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleGuard from './components/RoleGuard';
import { UserRole } from './types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Home from "./pages/Home1";
import Pricing from './pages/Pricing';
import AboutPage from './pages/About';
// import Home from './pages/Home';
import SchoolRegister from './pages/SchoolRegister';
import TeacherRegister from './pages/TeacherRegister';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SchoolsPage from './pages/admin/SchoolsPage';
import GlobalQuestionsPage from './pages/admin/GlobalQuestionsPage';
import UsersPage from './pages/admin/UsersPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import SchoolRequestsPage from './pages/admin/SchoolRequestsPage';
import TeacherRequestsPage from './pages/admin/TeacherRequestsPage';
import StandardsManagementPage from './pages/admin/StandardsManagementPage';
import SubjectsManagementPage from './pages/admin/SubjectsManagementPage';
import ChaptersManagementPage from './pages/admin/ChaptersManagementPage';
import SchoolDashboard from './pages/school/SchoolDashboard';
import TeachersPage from './pages/school/TeachersPage';
import SchoolQuestionsPage from './pages/school/SchoolQuestionsPage';
import SchoolPapersPage from './pages/school/SchoolPapersPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherQuestionsPage from './pages/teacher/TeacherQuestionsPage';
import MyPapersPage from './pages/teacher/MyPapersPage';
import CreatePaper from './pages/teacher/CreatePaper';
import PaperDetailsPage from './pages/teacher/PaperDetailsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Home />} />
        <Route path="/careers" element={<Home />} />
        <Route path="/security" element={<Home />} />
        <Route path="/privacy-policy" element={<Home />} />
        <Route path="/terms" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/school-register" element={<SchoolRegister />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          {/* Super Admin Routes */}
          <Route path="admin" element={<RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="school-requests" element={<SchoolRequestsPage />} />
            <Route path="teacher-requests" element={<TeacherRequestsPage />} />
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="standards" element={<StandardsManagementPage />} />
            <Route path="subjects" element={<SubjectsManagementPage />} />
            <Route path="chapters" element={<ChaptersManagementPage />} />
            <Route path="questions" element={<GlobalQuestionsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
          </Route>

          {/* School Admin Routes */}
          <Route path="school" element={<RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]} />}>
            <Route path="dashboard" element={<SchoolDashboard />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="questions" element={<SchoolQuestionsPage />} />
            <Route path="create-paper" element={<CreatePaper />} />
            <Route path="papers" element={<SchoolPapersPage />} />
            <Route path="papers/:id" element={<PaperDetailsPage />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="teacher" element={<RoleGuard allowedRoles={[UserRole.TEACHER]} />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="questions" element={<TeacherQuestionsPage />} />
            <Route path="create-paper" element={<CreatePaper />} />
            <Route path="papers" element={<MyPapersPage />} />
            <Route path="papers/:id" element={<PaperDetailsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;
