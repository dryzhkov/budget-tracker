import { Link } from "@remix-run/react";
import { useState } from "react";

import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Sheet, SheetContent } from "~/components/ui/sheet";

export function SidebarLayout({
  sidebarContent,
  children,
}: {
  sidebarContent: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-col overflow-y-auto border-r bg-card md:flex">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <nav className="flex flex-col gap-1 p-4 pt-8">
              <Button variant="ghost" className="justify-start" asChild>
                <Link
                  to={`/years/${new Date().getFullYear()}/statements`}
                  onClick={() => setSidebarOpen(false)}
                >
                  Statements
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link
                  to="/invoices"
                  onClick={() => setSidebarOpen(false)}
                >
                  Invoices
                </Link>
              </Button>
            </nav>
            <Separator />
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div onClick={() => setSidebarOpen(false)}>
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 overflow-y-scroll p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
