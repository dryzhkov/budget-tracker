import { Link, Outlet } from "@remix-run/react";

import { Header } from "~/components/header";

export default function InvoicesPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />

      <main className="flex h-full bg-white">
        <div className="h-full w-48 border-r bg-gray-50">
          <Link
            to="new"
            className="block p-4 text-md text-blue-500 hover:text-blue-600"
          >
            + New Invoice
          </Link>
          <hr />
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
