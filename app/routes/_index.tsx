import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Budget Tracker" }];

export const loader = async () => {
  return redirect(`/years/${new Date().getFullYear()}/statements`);
};
