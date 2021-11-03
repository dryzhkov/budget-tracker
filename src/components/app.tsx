/** @jsxImportSource @emotion/react */
import { ApolloProvider } from "../context/apolloProvider";
import { useAuth } from "../context/authProvider";
import { NavBar } from "./navBar";
import React, { useState } from "react";
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <NavBar />
      {token && isAuthenticated ? (
        <ApolloProvider>
          <div css={container}>
            <section css={left}>
              <StatementPicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </section>
            <section css={right}>
              <StatementEditor date={selectedDate} />
            </section>
          </div>
        </ApolloProvider>
      ) : null}
    </React.Suspense>
  );
}

export default App;
