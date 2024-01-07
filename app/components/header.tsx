import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export function Header() {
  const user = useOptionalUser();

  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-2xl">Budget Tracker</h1>

      {user ? (
        <>
          <div>
            <Link
              to={`/years/${new Date().getFullYear()}/statements`}
              className="hover:underline"
            >
              Statements
            </Link>
            {" | "}
            <Link to={`/invoices`} className="hover:underline">
              Invoices
            </Link>
          </div>
          <Form action="/logout" method="post">
            <span className="leading-10 mr-4">{user.email}</span>
            <button
              type="submit"
              className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        </>
      ) : null}
    </header>
  );
}
