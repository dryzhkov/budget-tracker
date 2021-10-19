import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider as Apollo,
  ApolloLink,
} from "@apollo/client";

import { useAuth } from "./AuthProvider";

const httpLink = createHttpLink({
  uri: "https://graphql.us.fauna.com/graphql",
});

const cache = new InMemoryCache();

const useApolloClient = () => {
  const { token } = useAuth();

  return new ApolloClient({
    link: createAuthLink(token).concat(httpLink),
    cache,
  });
};

const createAuthLink = (authToken: string | undefined) =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    if (authToken) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
    }

    return forward(operation);
  });

export function ApolloProvider({ children }: { children: JSX.Element }) {
  const client = useApolloClient();
  return <Apollo client={client}> {children} </Apollo>;
}
