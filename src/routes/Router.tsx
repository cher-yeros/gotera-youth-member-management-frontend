import { lazy } from "react";
import { Navigate } from "react-router";

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
const Login = lazy(() => import("../views/authentication/Login"));
const ComboBoxTest = lazy(() => import("../components/test/ComboBoxTest"));

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/members", element: <Members /> },
      { path: "/overview", element: <OverviewPage /> },
      { path: "/families", element: <FamiliesPage /> },
      { path: "/families/:familyId/members", element: <FamilyMembers /> },
      { path: "/professions", element: <ProfessionsPage /> },
      { path: "/locations", element: <LocationsPage /> },
      { path: "/test-combobox", element: <ComboBoxTest /> },
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
