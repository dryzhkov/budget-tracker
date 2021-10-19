import "./App.css";

import { ApolloProvider } from "./context/ApolloProvider";
import { Categories } from "./Categories";
import { useAuth } from "./context/AuthProvider";

function App() {
  const { logout, isAuthenticated, user, login, token } = useAuth();

  const handleSignoutClick = () => logout();

  const handleLoginClick = () => login();

  return (
    <div className="App">
      <header className="App-header">Put Header Here!</header>
      <div>
        {token && isAuthenticated ? (
          <ApolloProvider>
            <section>
              <p>Your token is: {token}</p>
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
