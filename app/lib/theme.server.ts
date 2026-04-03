import { createCookie } from "@remix-run/node";

const themeCookie = createCookie("__theme", {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: "lax",
  path: "/",
});

export type Theme = "light" | "dark";

export async function getTheme(request: Request): Promise<Theme> {
  const cookieHeader = request.headers.get("Cookie");
  const theme = await themeCookie.parse(cookieHeader);
  if (theme === "dark") return "dark";
  return "light";
}

export async function serializeTheme(theme: Theme): Promise<string> {
  return themeCookie.serialize(theme);
}
