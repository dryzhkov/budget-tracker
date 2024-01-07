import { Form, Link } from "@remix-run/react";

import { useUser } from "~/utils";

export function Header({ linkText }: { linkText: string }) {
  const user = useUser();

  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-2xl">
        <Link className="hover:underline" to="/">
          Budget Tracker
        </Link>
        {" | "}
        <Link to="." className="hover:underline">
          {linkText}
        </Link>
      </h1>
      <Form action="/logout" method="post">
        <span className="leading-10 mr-4">{user.email}</span>
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}
