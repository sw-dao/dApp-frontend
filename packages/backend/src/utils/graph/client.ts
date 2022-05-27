import "cross-fetch/polyfill";

import { ApolloClient, ApolloLink, from, split } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client/link/http";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import WebSocket from "ws";

const gqlEndpoint =
  process.env.HASURA_GQL_ENDPOINT || "http://localhost:8080/v1/graphql";

console.log(`[GraphQL client]: GraphQL endpoint${gqlEndpoint}`);

const hasuraSecret = process.env.HASURA_SECRET || "";

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": hasuraSecret,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const additiveLink = (linkToAdd: ApolloLink) => {
  return from([authLink, errorLink, linkToAdd]);
};

const wsLink = new GraphQLWsLink(
  createClient({
    url: gqlEndpoint,
    webSocketImpl: WebSocket,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": hasuraSecret,
      },
    },
  })
);

const httpLink = new HttpLink({
  uri: gqlEndpoint,
  credentials: "same-origin",
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },

  additiveLink(wsLink),
  additiveLink(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
