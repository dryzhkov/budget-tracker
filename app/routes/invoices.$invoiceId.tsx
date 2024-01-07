import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { InvoiceForm } from "~/components/invoiceForm";
import { prisma } from "~/db.server";
import { deleteInvoice, updateInvoice } from "~/models/invoice.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const invoiceId = Number(params.invoiceId);
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    throw new Response("Invoice does not exist", {
      status: 404,
    });
  }

  if (invoice.userId !== userId) {
    throw new Response("User not authorized to access this invoice", {
      status: 403,
    });
  }

  return json({ invoice });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (!(intent === "save" || intent === "delete")) {
    throw new Response(`The intent ${intent} is not supported`, {
      status: 400,
    });
  }

  const invoiceId = Number(params.invoiceId);
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    throw new Response("Invoice does not exist", {
      status: 404,
    });
  }

  if (invoice.userId !== userId) {
    throw new Response("User not authorized to modify this invoice", {
      status: 403,
    });
  }

  if (intent === "delete") {
    await deleteInvoice({ id: invoiceId, userId });
  } else {
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

    await updateInvoice({
      id: invoiceId,
      userId,
      title,
      category,
      frequency,
      state,
      externalUrl,
    });
  }

  return redirect("/invoices");
};

export default function NewInvoicePage() {
  const { invoice } = useLoaderData<typeof loader>();
  return <InvoiceForm action={action} invoice={invoice} />;
}
