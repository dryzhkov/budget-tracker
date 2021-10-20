import { ApolloProvider } from "../context/apolloProvider";
import { Categories } from "./categories";
import { useAuth } from "../context/authProvider";
import { NavBar } from "./navBar";
import React from "react";
import { FullPageSpinner } from "./lib";

function App() {
  const { isAuthenticated, user, token } = useAuth();

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <NavBar />
      {token && isAuthenticated ? (
        <ApolloProvider>
          <div>
            <section>
              <p>Your token is: {token}</p>
              <div>
                <img src={user?.picture} alt={user?.name} />
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </div>
            </section>
            <Categories />
          </div>
        </ApolloProvider>
      ) : null}
    </React.Suspense>
  );
}

export default App;
