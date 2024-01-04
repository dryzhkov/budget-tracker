import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createInvoice } from "~/models/invoice";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

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
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.date) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1" htmlFor="datepicker">
          <span>Title: </span>
          <input
            type="text"
            id="title"
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            placeholder="Enter a title"
            ref={titleRef}
            aria-invalid={actionData?.errors?.date ? true : undefined}
            aria-errormessage={
              actionData?.errors?.date ? "date-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.date ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.date}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Category: </span>
          <select
            id="category"
            name="category"
            className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="saving">Saving</option>
          </select>
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Frequency: </span>
          <select
            id="frequency"
            name="frequency"
            className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="bi-weekly">Bi Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="bi-monthly">Bi Monthly</option>
            <option value="quaterly">Quaterly</option>
            <option value="one-off">One Off</option>
          </select>
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>State: </span>
          <select
            id="state"
            name="state"
            className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>External Url: </span>
          <input
            type="text"
            id="url"
            name="url"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            placeholder="Enter a url"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
