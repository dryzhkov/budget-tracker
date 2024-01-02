import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";

import { YearPicker } from "~/components/yearPicker";
import {
  getStatementListItems,
  getStatementYears,
} from "~/models/statement.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const { year } = params;
  const statements = await getStatementListItems({
    userId,
    year: Number(year),
  });

  const years = (await getStatementYears({ userId })).map((col) => col.year);

  return json({ statements, years });
};

export default function StatementsPage() {
  const { statements, years } = useLoaderData<typeof loader>();
  const user = useUser();

  const { year } = useParams();
  const navigate = useNavigate();

  const handleYearChange = (year: number) => {
    navigate(`/years/${year}/statements`);
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Statements</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <div className="p-4">
            <YearPicker
              onYearChange={handleYearChange}
              defaultValue={year ? Number(year) : new Date().getFullYear()}
              years={years}
            />
          </div>
          <hr />

          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Statement
          </Link>
          <hr />

          {statements.length === 0 ? (
            <p className="p-4">No statements yet</p>
          ) : (
            <ol>
              {statements.map((statement) => (
                <li key={statement.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={statement.id.toString()}
                  >
                    📝 {new Date(statement.date).toISOString().split("T")[0]}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
