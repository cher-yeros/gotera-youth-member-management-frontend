import { lazy } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

// Layouts
const FullLayout = lazy(() => import("../layouts/full/FullLayout"));
const BlankLayout = lazy(() => import("../layouts/blank/BlankLayout"));

// Pages
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
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
      { path: "/", element: <Navigate to="/dashboard" /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
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
