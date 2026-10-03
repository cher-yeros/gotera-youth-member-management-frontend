import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { OperationTypeNode } from "graphql";
import { createClient } from "graphql-ws";
import { store } from "@/redux/store";
import { getGraphqlHttpUrl, getGraphqlWsUrl } from "@/lib/apiOrigin";

const httpLink = new HttpLink({
  uri: getGraphqlHttpUrl(),
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: getGraphqlWsUrl(),
    connectionParams: () => {
      const token = store.getState().auth?.token;
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
    lazy: true,
    retryAttempts: Infinity,
  }),
);

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

const splitLink = ApolloLink.split(
  ({ operationType }) => operationType === OperationTypeNode.SUBSCRIPTION,
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: from([splitLink]),
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
  } as ApolloClient.DefaultOptions,
});

export default client;
