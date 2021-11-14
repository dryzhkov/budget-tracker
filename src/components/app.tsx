/** @jsxImportSource @emotion/react */
import { ApolloProvider } from "../context/apolloProvider";
import { useAuth } from "../context/authProvider";
import { NavBar } from "./navBar";
import React, { useState } from "react";
import { FullPageSpinner } from "./lib";
import { StatementDto, StatementPicker } from "./statementPicker";
import { StatementEditor } from "./statementEditor";
import { css } from "@emotion/react";

const container = css`
  padding: 10px;
  display: flex;
  height: calc(100vh - 50px);
`;

const left = css`
  flex: 0 0 350px;
  padding: 20px;
`;
const right = css`
  flex: 1;
  padding: 20px;
`;

function App() {
  const { isAuthenticated, token } = useAuth();
  const [selectedStatement, setSelectedStatement] =
    useState<StatementDto | null>(null);

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <NavBar />
      {token && isAuthenticated ? (
        <ApolloProvider>
          <div css={container}>
            <section css={left}>
              <StatementPicker
                statement={selectedStatement}
                setSelectedStatement={setSelectedStatement}
              />
            </section>
            <section css={right}>
              {selectedStatement && (
                <StatementEditor
                  statement={selectedStatement}
                  setSelectedStatement={setSelectedStatement}
                />
              )}
            </section>
          </div>
        </ApolloProvider>
      ) : null}
    </React.Suspense>
  );
}

export default App;
