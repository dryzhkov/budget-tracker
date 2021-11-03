import React from "react";
import { dateToString } from "utils/dates";
interface StatementEditorProps {
  date: Date | null;
}

export function StatementEditor({ date }: StatementEditorProps) {
  return <div>Statement Editor: {date && dateToString(date)}</div>;
}
