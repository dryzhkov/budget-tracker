import { useGetStatementByIdQuery } from "generated/graphql";
import React from "react";
import { dateToString } from "utils/dates";
import { Spinner } from "./lib";
import { StatementDto } from "./statementPicker";
interface StatementEditorProps {
  statement: StatementDto | null;
}

export function StatementEditor({ statement }: StatementEditorProps) {
  const { data, loading, error } = useGetStatementByIdQuery({
    variables: { id: statement?.id ?? "" },
    skip: !statement?.id,
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Oops, error happened. {JSON.stringify(error)}</div>;
  }

  return (
    <>
      <div>Statement Editor: {statement && dateToString(statement.date)}</div>
      <div>
        Statement Details:
        <br />
        {JSON.stringify(data?.findStatementByID)}
      </div>
    </>
  );
}
