import { ApolloProvider } from "../context/apolloProvider";
import { useAuth } from "../context/authProvider";
import { NavBar } from "./navBar";
import React from "react";
import { FullPageSpinner } from "./lib";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Categories } from "./categories";
import { Budget } from "./budget";

function App() {
  const { isAuthenticated, token } = useAuth();

  return (
    <BrowserRouter>
      <React.Suspense fallback={<FullPageSpinner />}>
        <NavBar />
        {token && isAuthenticated ? (
          <ApolloProvider>
            <Routes>
              <Route path="/" element={<Budget />} />
              <Route path="categories" element={<Categories />} />
            </Routes>
          </ApolloProvider>
        ) : null}
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
