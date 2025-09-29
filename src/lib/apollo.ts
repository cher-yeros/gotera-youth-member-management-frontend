import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { store } from "@/redux/store";

// HTTP Link
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// Auth Link
const authLink = setContext((_, { headers }) => {
  const state = store.getState();
  const token = state.auth?.token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          members: {
            keyArgs: ["filter"],
            merge(existing, incoming, { args }) {
              const { pagination } = args || {};
              const page = pagination?.page || 1;

              if (page === 1) {
                return incoming;
              }

              return {
                ...incoming,
                members: [...(existing?.members || []), ...incoming.members],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export default client;
