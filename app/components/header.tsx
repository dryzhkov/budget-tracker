import { Form, Link } from "@remix-run/react";
import { Menu } from "lucide-react";

import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { useOptionalUser } from "~/utils";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = useOptionalUser();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
      {onMenuClick ? (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      ) : null}

      <h1 className="text-lg font-semibold">
        <Link to="/">Budget Tracker</Link>
      </h1>

      {user ? (
        <>
          <nav className="ml-4 hidden gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link to={`/years/${new Date().getFullYear()}/statements`}>
                Statements
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/invoices">Invoices</Link>
            </Button>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <ThemeToggle />
            <Form action="/logout" method="post">
              <Button variant="outline" size="sm" type="submit">
                Logout
              </Button>
            </Form>
          </div>
        </>
      ) : (
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      )}
    </header>
  );
}
