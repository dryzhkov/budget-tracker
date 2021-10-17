import React, { useEffect } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Categories } from "./Categories";

function App() {
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated && !localStorage.getItem("token")) {
        const token = await getAccessTokenSilently();
        localStorage.setItem("token", token);
      }
    };

    void fetchToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  const handleSignoutClick = () => {
    localStorage.removeItem("token");
    logout();
  };

  const handleLoginClick = async () => {
    loginWithRedirect();
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="App">
      <header className="App-header">Put Header Here!</header>
      <div>
        {isAuthenticated && user ? (
          <section>
            <p>
              Your token is: {JSON.stringify(localStorage.getItem("token"))}
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
    </div>
  );
}

export default App;
