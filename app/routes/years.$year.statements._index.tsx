import { Link } from "@remix-run/react";

export default function StatementIndexPage() {
  return (
    <p>
      No statement selected. Select a statement on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new statement.
      </Link>
    </p>
  );
}
