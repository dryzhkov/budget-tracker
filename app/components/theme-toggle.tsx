import { useFetcher } from "@remix-run/react";
import { Moon, Sun } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useTheme } from "~/lib/theme-provider";

export function ThemeToggle() {
  const { theme } = useTheme();
  const fetcher = useFetcher();

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <fetcher.Form method="post" action="/">
      <input type="hidden" name="intent" value="setTheme" />
      <input type="hidden" name="theme" value={nextTheme} />
      <Button type="submit" variant="ghost" size="icon">
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </fetcher.Form>
  );
}
