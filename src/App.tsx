import React, { useEffect, useState } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { ApolloProvider } from "./context/ApolloProvider";
import { Categories } from "./Categories";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
    user,
  } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated && !token) {
        const accessToken = await getAccessTokenSilently();
        localStorage.setItem("token", accessToken);
        setToken(accessToken);
      }
    };

    void fetchToken();
  }, [getAccessTokenSilently, isAuthenticated, token]);

  const handleSignoutClick = () => {
    localStorage.removeItem("token");
    setToken(null);
    logout();
  };

  const handleLoginClick = () => {
    loginWithRedirect();
  };

  return (
    <div className="App">
      <header className="App-header">Put Header Here!</header>
      <div>
        {token && isAuthenticated ? (
          <ApolloProvider>
            <section>
              <p>
                Your token is: {JSON.stringify(localStorage.getItem("token"))}
              </p>
              <div>
                <img src={user?.picture} alt={user?.name} />
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </div>
              <button onClick={handleSignoutClick}>Sign Out</button>
              <Categories />
            </section>
          </ApolloProvider>
        ) : (
          <section>
            <button onClick={handleLoginClick}>Sign In Here!</button>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
