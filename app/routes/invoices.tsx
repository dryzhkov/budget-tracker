import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, NavLink, Outlet, json, useLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";

import { SidebarLayout } from "~/components/sidebar-layout";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getInvoices } from "~/models/invoice.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const invoices = await getInvoices(userId);
  return json({ invoices });
};

export default function InvoicesPage() {
  const { invoices } = useLoaderData<typeof loader>();

  const sidebarContent = (
    <div className="flex flex-col">
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link to="new">
            <Plus className="h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>
      <Separator />
      {invoices.length ? (
        <nav className="flex flex-col">
          {invoices.map((invoice) => (
            <NavLink
              key={invoice.id}
              className={({ isActive }) =>
                `block border-b px-4 py-3 text-sm transition-colors hover:bg-accent ${
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground"
                }`
              }
              to={`${invoice.id.toString()}/list`}
            >
              {invoice.title}
            </NavLink>
          ))}
        </nav>
      ) : (
        <p className="p-4 text-sm text-muted-foreground">No invoices yet</p>
      )}
    </div>
  );

  return (
    <SidebarLayout sidebarContent={sidebarContent}>
      <Outlet />
    </SidebarLayout>
  );
}
