export function getRouteMeta(path: string) {
  // Handle routes with query parameters generically
  const [basePath] = path.split("?");

  if (routeMetaMap[basePath]) {
    return routeMetaMap[basePath];
  }
  return {
    title: "Unknown Page",
    description: "No description available for this route.",
  };
}

export const routeMetaMap: Record<
  string,
  { title: string; description: string }
> = {
  // Dashboard
  "/dashboard": {
    title: "Dashboard",
    description:
      "Overview of key statistics and recent activity in the admin panel.",
  },

  // Member Management
  "/members": {
    title: "Members",
    description: "Manage youth member profiles and information.",
  },
  "/members/new": {
    title: "New Member",
    description: "Register a new youth member in the system.",
  },
  "/members/:id": {
    title: "View Member",
    description: "View the details of a specific member.",
  },
  "/members/update/:id": {
    title: "Update Member",
    description: "Update member information and details.",
  },

  // Authentication
  "/auth/login": {
    title: "Login",
    description: "Sign in to access the youth member management system.",
  },
  "/auth/register": {
    title: "Register",
    description: "Create a new account in the system.",
  },
  "/auth/404": {
    title: "Page Not Found",
    description: "The requested page could not be found.",
  },
};
