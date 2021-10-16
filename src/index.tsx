import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { Categories } from './components/Categories';

const httpLink = createHttpLink({
  uri: 'https://graphql.us.fauna.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Bind to events
const App = () => {
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  const handleSignoutClick = () => {
    localStorage.removeItem('token');
    logout();
  };

  const handleLoginClick = async () => {
    loginWithRedirect();
  };

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated && !localStorage.getItem('token')) {
        const token = await getAccessTokenSilently();
        localStorage.setItem('token', token);
      }
    };

    void fetchToken();
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div>
        {isAuthenticated && user ? (
          <section>
            <p>
              Your token is: {JSON.stringify(localStorage.getItem('token'))}
            </p>
            <div>
              <img src={user.picture} alt={user.name} />
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <button onClick={handleSignoutClick}>Sign Out</button>

            <Categories />
          </section>
        ) : (
          <section>
            <button onClick={handleLoginClick}>Sign In Here!</button>
          </section>
        )}
      </div>
    </>
  );
};

ReactDOM.render(
  <Auth0Provider
    domain="dimaryz.auth0.com"
    clientId="ehnorKu18hGNn09pl5MzItqPYciDl7UX"
    audience="https://db.fauna.com/db/ytkuu7stcynrq"
    redirectUri={window.location.origin}
  >
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Auth0Provider>,
  document.getElementById('root')
);
