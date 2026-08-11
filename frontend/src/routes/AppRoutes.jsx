// src/routes/AppRoutes.jsx

import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import LandingPage from "../pages/Landing";
import Collage from "../pages/Collage";

import Login from "../features/auth/Login";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";
import useAuth from "../features/auth/useAuth";
import { getDashboardPath } from "../features/auth/roleRouting";

import DashboardLayout from "../Components/Layouts/DashboardLayout";
import GuestRoute from "../Components/GuestRoute";
import ProtectedRoute from "../Components/ProtectedRoute";
import AuthGateLoader from "../Components/Shared/AuthGateLoader";

import ProfilePage from "../pages/Profile/index";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";

import StudentDashboard from '../features/student/pages/StudentDashboard';
import StudentRequests from '../features/student/pages/StudentRequests';
import StudentComplaints from '../features/student/pages/StudentComplaints';
import StudentRecordDetailsPage from '../features/student/pages/StudentRecordDetailsPage';
import CreateRequestPage from '../features/student/pages/CreateRequestPage';
import RequestFormPage from '../features/student/pages/RequestFormPage';
import CreateComplaintPage from '../features/student/pages/CreateComplaintPage';
import PaymentsPage from '../features/student/pages/PaymentsPage';

import {
  fetchStudentComplaintDetails,
  fetchStudentRequestDetails,
} from "../features/student/studentService";

import AcademicDashboard from "../features/academic/pages/AcademicDashboard";

import AffairsDashboard from "../features/affairs/pages/AffairsDashboard";
import AffairsRequests from "../features/affairs/pages/AffairsRequests";
import AffairsComplaints from "../features/affairs/pages/AffairsComplaints";
import AffairsRecordDetailsPage from "../features/affairs/pages/AffairsRecordDetailsPage";

import {
  fetchAffairsComplaintDetails,
  fetchAffairsRequestDetails,
} from "../features/affairs/affairsService";

import AdminDashboard from '../features/admin/pages/AdminDashboard';
import UsersManagementPage from '../features/admin/pages/UsersManagementPage';
import UserDetailPage from '../features/admin/pages/UserDetailPage';
import AdminEditUserPage from "../features/admin/pages/AdminEditUserPage";

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return null;
};

const DashboardRedirect = () => {
  const { userRole } = useAuth();
  if (!userRole) return <AuthGateLoader />;
  return <Navigate to={getDashboardPath(userRole)} replace />;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collage" element={<Collage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/student" element={<StudentDashboard />} />

            <Route path="/dashboard/student/requests" element={<StudentRequests />} />
            <Route path="/dashboard/student/requests/new" element={<CreateRequestPage />} />
            <Route path="/dashboard/student/requests/new/:requestTypeCode" element={<RequestFormPage />} />
            <Route path="/dashboard/student/dues" element={<PaymentsPage />} />

            <Route
              path="/dashboard/student/requests/:recordId"
              element={
                <StudentRecordDetailsPage
                  recordKind="request"
                  pageTitle="Request Details"
                  backPath="/dashboard/student/requests"
                  loadRecordDetails={fetchStudentRequestDetails}
                />
              }
            />

            <Route path="/dashboard/student/complaints" element={<StudentComplaints />} />
            <Route path="/dashboard/student/complaints/new" element={<CreateComplaintPage />} />

            <Route
              path="/dashboard/student/complaints/:recordId"
              element={
                <StudentRecordDetailsPage
                  recordKind="complaint"
                  pageTitle="Complaint Details"
                  backPath="/dashboard/student/complaints"
                  loadRecordDetails={fetchStudentComplaintDetails}
                />
              }
            />
          </Route>
        </Route>

        {/* Academic Routes */}
        <Route element={<ProtectedRoute allowedRoles={['academic_staff']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/academic" element={<AcademicDashboard />} />
            <Route path="/dashboard/academic/requests" element={<AffairsRequests />} />
            <Route
              path="/dashboard/academic/requests/:recordId"
              element={
                <AffairsRecordDetailsPage
                  recordKind="request"
                  pageTitle="Request Details"
                  loadRecordDetails={fetchAffairsRequestDetails}
                />
              }
            />
          </Route>
        </Route>

        {/* Affairs Routes */}
        <Route element={<ProtectedRoute allowedRoles={['affairs_staff']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/affairs" element={<AffairsDashboard />} />
            <Route path="/dashboard/affairs/requests" element={<AffairsRequests />} />
            <Route path="/dashboard/affairs/complaints" element={<AffairsComplaints />} />
            <Route
              path="/dashboard/affairs/complaints/:recordId"
              element={
                <AffairsRecordDetailsPage
                  recordKind="complaint"
                  pageTitle="Complaint Details"
                  loadRecordDetails={fetchAffairsComplaintDetails}
                />
              }
            />
            <Route
              path="/dashboard/affairs/requests/:recordId"
              element={
                <AffairsRecordDetailsPage
                  recordKind="request"
                  pageTitle="Request Details"
                  loadRecordDetails={fetchAffairsRequestDetails}
                />
              }
            />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            <Route path="/dashboard/admin/users" element={<UsersManagementPage />} />
            <Route path="/dashboard/admin/users/:userId" element={<UserDetailPage />} />
            <Route
              path="/dashboard/admin/users/:userId/edit"
              element={<AdminEditUserPage />}
            />
            <Route path="/dashboard/admin/requests" element={<AffairsRequests />} />
            
            <Route
              path="/dashboard/admin/requests/:recordId"
              element={
                <AffairsRecordDetailsPage
                  recordKind="request"
                  pageTitle="Request Details"
                  loadRecordDetails={fetchAffairsRequestDetails}
                />
              }
            />
            <Route path="/dashboard/admin/complaints" element={<AffairsComplaints />} />
            <Route
              path="/dashboard/admin/complaints/:recordId"
              element={
                <AffairsRecordDetailsPage
                  recordKind="complaint"
                  pageTitle="Complaint Details"
                  loadRecordDetails={fetchAffairsComplaintDetails}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
