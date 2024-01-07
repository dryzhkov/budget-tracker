import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

import { getInvoices } from "~/models/invoice.server";
import { requireUserId } from "~/session.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const invoices = await getInvoices(userId);

  return json({ invoices });
};

export default function InvoicesIndexPage() {
  const { invoices } = useLoaderData<typeof loader>();

  if (invoices.length === 0) {
    return <p className="p-4">No invoices yet</p>;
  }
  return (
    <ol>
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <NavLink
            className={({ isActive }) =>
              `block border-b p-4 text-md ${isActive ? "bg-white" : ""}`
            }
            to={invoice.id.toString()}
          >
            📝 {invoice.title}
          </NavLink>
        </li>
      ))}
    </ol>
  );
}
