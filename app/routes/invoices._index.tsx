import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { getInvoices } from "~/models/invoice.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const invoices = await getInvoices(userId);
  return json({ invoices });
};

export default function InvoicesIndexPage() {
  return (
    <p className="text-muted-foreground">
      No invoice selected. Select an invoice on the left, or{" "}
      <Link to="new" className="text-primary underline">
        create a new invoice.
      </Link>
    </p>
  );
}
