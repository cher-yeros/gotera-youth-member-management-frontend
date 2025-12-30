import { lazy } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import RoleBasedDashboard from "@/components/shared/RoleBasedDashboard";

// Layouts
const FullLayout = lazy(() => import("../layouts/full/FullLayout"));
const BlankLayout = lazy(() => import("../layouts/blank/BlankLayout"));

// Pages
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const FamilyLeaderDashboard = lazy(
  () => import("../views/dashboard/FamilyLeaderDashboard")
);
const MinistryLeaderDashboard = lazy(
  () => import("../views/dashboard/MinistryLeaderDashboard")
);
const Members = lazy(() => import("../views/members/Members"));
const OverviewPage = lazy(() => import("../views/overview/OverviewPage"));
const FamiliesPage = lazy(() => import("../views/families/FamiliesPage"));
const FamilyMembers = lazy(() => import("../views/families/FamilyMembers"));
const ProfessionsPage = lazy(
  () => import("../views/professions/ProfessionsPage")
);
const LocationsPage = lazy(() => import("../views/locations/LocationsPage"));
const FamilyMemberMapping = lazy(
  () => import("../views/family-mapping/FamilyMemberMapping")
);
const ActivityLogs = lazy(() => import("../views/activity-logs/ActivityLogs"));
const AttendanceManagement = lazy(
  () => import("../views/attendance/AttendanceManagement")
);
const FamilyMeetupsManagement = lazy(
  () => import("../views/family-meetups/FamilyMeetupsManagement")
);
const MinistriesManagement = lazy(
  () => import("../views/ministries/MinistriesManagement")
);
const MinistryMembers = lazy(
  () => import("../views/ministries/MinistryMembers")
);
const Login = lazy(() => import("../views/authentication/Login"));
const ComboBoxTest = lazy(() => import("../components/test/ComboBoxTest"));

const Router = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <RoleBasedDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/family-dashboard",
        element: (
          <ProtectedRoute requiredRole="fl">
            <FamilyLeaderDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ministry-dashboard",
        element: (
          <ProtectedRoute requiredRole="ml">
            <MinistryLeaderDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ministries",
        element: (
          <ProtectedRoute requiredRole="admin">
            <MinistriesManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ministries/:ministryId/members",
        element: (
          <ProtectedRoute>
            <MinistryMembers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ministries/my-ministry",
        element: (
          <ProtectedRoute requiredRole="ml">
            <MinistryMembers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/members",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Members />
          </ProtectedRoute>
        ),
      },
      {
        path: "/overview",
        element: (
          <ProtectedRoute requiredRole="admin">
            <OverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/families",
        element: (
          <ProtectedRoute requiredRole="admin">
            <FamiliesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/families/:familyId/members",
        element: (
          <ProtectedRoute>
            <FamilyMembers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/families/my-family",
        element: (
          <ProtectedRoute requiredRole="fl">
            <FamilyMembers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/professions",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ProfessionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/locations",
        element: (
          <ProtectedRoute requiredRole="admin">
            <LocationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/family-mapping",
        element: (
          <ProtectedRoute requiredRole="admin">
            <FamilyMemberMapping />
          </ProtectedRoute>
        ),
      },
      {
        path: "/activity-logs",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ActivityLogs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/attendance",
        element: (
          <ProtectedRoute requiredRole="fl">
            <AttendanceManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/family-meetups",
        element: (
          <ProtectedRoute requiredRole="admin">
            <FamilyMeetupsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/test-combobox",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ComboBoxTest />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "*", element: <Navigate to="/auth/login" /> },
    ],
  },
];

export default Router;
