/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { StatementDto, StatementPicker } from "./statementPicker";
import { StatementEditor } from "./statementEditor";
import { css } from "@emotion/react";

const container = css`
  padding: 10px;
  display: flex;
  height: calc(100vh - 50px);
`;
const left = css`
  flex: 0 0 225px;
  padding: 20px;
`;
const right = css`
  flex: 1;
  padding: 20px;
`;

export function Budget() {
  const [selectedStatement, setSelectedStatement] =
    useState<StatementDto | null>(null);

  return (
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
  );
}
