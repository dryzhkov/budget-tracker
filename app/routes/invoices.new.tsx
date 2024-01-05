import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { InvoiceForm } from "~/components/invoiceForm";
import { createInvoice } from "~/models/invoice";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  if (formData.get("intent") !== "save") {
    throw new Response(
      `The intent ${formData.get("intent")} is not supported`,
      { status: 400 },
    );
  }

  const title = formData.get("title");
  if (typeof title !== "string" || title.length < 2) {
    return json(
      { errors: { body: null, date: "Invalid title" } },
      { status: 400 },
    );
  }

  const category = formData.get("category");
  if (typeof category !== "string" || category.length === 0) {
    return json(
      { errors: { body: null, date: "Invalid category" } },
      { status: 400 },
    );
  }

  const frequency = formData.get("frequency");
  if (typeof frequency !== "string" || frequency.length === 0) {
    return json(
      { errors: { body: null, date: "Invalid frequency" } },
      { status: 400 },
    );
  }

  const state = formData.get("state");
  if (typeof state !== "string" || state.length === 0) {
    return json(
      { errors: { body: null, date: "Invalid state" } },
      { status: 400 },
    );
  }

  const externalUrl = formData.get("url") ?? "";
  if (typeof externalUrl !== "string" && externalUrl !== null) {
    return json(
      { errors: { body: null, date: "Invalid url" } },
      { status: 400 },
    );
  }

  await createInvoice({
    userId,
    title,
    category,
    frequency,
    state,
    externalUrl,
  });

  return redirect("/invoices");
};

export default function NewInvoicePage() {
  return <InvoiceForm action={action} />;
}
