import { Link } from "@remix-run/react";

export default function StatementIndexPage() {
  return (
    <p className="text-muted-foreground">
      No statement selected. Select a statement on the left, or{" "}
      <Link to="new" className="text-primary underline">
        create a new statement.
      </Link>
    </p>
  );
}
