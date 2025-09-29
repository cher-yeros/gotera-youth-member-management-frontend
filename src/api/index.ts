// Legacy API file - now using Apollo Client
// This file is kept for backward compatibility
// All GraphQL operations should use the hooks from src/hooks/useGraphQL.ts

import apolloClient from "../lib/apollo";

// Export Apollo Client for direct use if needed
export { apolloClient };

// Legacy axios instance - deprecated, use Apollo Client instead
import { store } from "@/redux/store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/graphql", // GraphQL endpoint for Gotera Youth backend
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
