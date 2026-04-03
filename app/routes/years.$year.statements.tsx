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
import { Plus } from "lucide-react";

import { SidebarLayout } from "~/components/sidebar-layout";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { YearPicker } from "~/components/yearPicker";
import {
  getStatementListItems,
  getStatementYears,
} from "~/models/statement.server";
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

  const sidebarContent = (
    <div className="flex flex-col">
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link to="new">
            <Plus className="h-4 w-4" />
            New Statement
          </Link>
        </Button>
      </div>
      <Separator />
      <div className="p-4">
        <YearPicker
          onYearChange={handleYearChange}
          defaultValue={year ? Number(year) : new Date().getFullYear()}
          years={years}
        />
      </div>
      <Separator />

      {statements.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">No statements yet</p>
      ) : (
        <nav className="flex flex-col">
          {statements.map((statement) => (
            <NavLink
              key={statement.id}
              className={({ isActive }) =>
                `block border-b px-4 py-3 text-sm transition-colors hover:bg-accent ${
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground"
                }`
              }
              to={statement.id.toString()}
            >
              {formatDate(statement.date)}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );

  return (
    <SidebarLayout sidebarContent={sidebarContent}>
      <Outlet />
    </SidebarLayout>
  );
}
