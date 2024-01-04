import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";

import { Header } from "~/components/header";
import { YearPicker } from "~/components/yearPicker";
import { getStatementListItems, getStatementYears } from "~/models/statement";
import { requireUserId } from "~/session.server";
import { formatDate } from "~/utils";

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

  const { year } = useParams();
  const navigate = useNavigate();

  const handleYearChange = (year: number) => {
    navigate(`/years/${year}/statements`);
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header linkText="Statements" />

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
                    📝 {formatDate(statement.date)}
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
