import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { ThemeProvider } from "~/lib/theme-provider";
import { getTheme, serializeTheme } from "~/lib/theme.server";
import type { Theme } from "~/lib/theme.server";
import { cn } from "~/lib/utils";
import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [user, theme] = await Promise.all([
    getUser(request),
    getTheme(request),
  ]);
  return json({ user, theme });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "setTheme") {
    const theme = formData.get("theme") as Theme;
    return json(
      { success: true },
      {
        headers: {
          "Set-Cookie": await serializeTheme(theme),
        },
      },
    );
  }

  return json({ success: false }, { status: 400 });
};

export default function App() {
  const { theme } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className={cn("h-full", theme === "dark" && "dark")}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-background text-foreground">
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
