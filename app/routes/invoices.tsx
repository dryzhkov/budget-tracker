import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, NavLink, Outlet, json, useLoaderData } from "@remix-run/react";

import { Header } from "~/components/header";
import { getInvoices } from "~/models/invoice.server";
import { requireUserId } from "~/session.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const invoices = await getInvoices(userId);

  return json({ invoices });
};
export default function InvoicesPage() {
  const { invoices } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />

      <main className="flex bg-white">
        <div className="w-48 border-r bg-gray-50">
          <Link
            to="new"
            className="block p-4 text-md text-blue-500 hover:text-blue-600"
          >
            + New Invoice
          </Link>
          <hr />
          {invoices.length ? (
            <ol className="max-w-md">
              {invoices.map((invoice) => (
                <li key={invoice.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-md ${isActive ? "bg-white" : ""}`
                    }
                    to={`${invoice.id.toString()}/list`}
                  >
                    📝 {invoice.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          ) : (
            <p className="p-4">No invoices yet</p>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
