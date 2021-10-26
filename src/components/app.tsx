/** @jsxImportSource @emotion/react */
import { ApolloProvider } from "../context/apolloProvider";
import { useAuth } from "../context/authProvider";
import { NavBar } from "./navBar";
import React from "react";
import { FullPageSpinner } from "./lib";
import { StatementPicker } from "./statementPicker";
import { StatementEditor } from "./statementEditor";
import { css } from "@emotion/react";
import * as colors from "styles/colors";

const container = css`
  padding: 10px;
  display: flex;
  height: calc(100vh - 50px);
`;

const left = css`
  flex: 0 0 350px;
  padding: 20px;
  border: 1px solid ${colors.green};
`;
const right = css`
  flex: 1;
  padding: 20px;
  border: 1px dashed ${colors.green};
`;

function App() {
  const { isAuthenticated, token } = useAuth();

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <NavBar />
      {token && isAuthenticated ? (
        <ApolloProvider>
          <div css={container}>
            <section css={left}>
              <StatementPicker />
            </section>
            <section css={right}>
              <StatementEditor />
            </section>
          </div>
        </ApolloProvider>
      ) : null}
    </React.Suspense>
  );
}

export default App;
