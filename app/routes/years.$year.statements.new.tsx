import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createStatement } from "~/models/statement.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const rawDate = formData.get("date");

  if (typeof rawDate !== "string" || rawDate.length === 0) {
    return json(
      { errors: { body: null, date: "Date is required" } },
      { status: 400 },
    );
  }

  const date = new Date(rawDate);

  if (isNaN(date.getTime())) {
    return json(
      { errors: { body: null, date: "Date must be valid" } },
      { status: 400 },
    );
  }

  const year = Number(date.getFullYear());

  const statement = await createStatement({
    userId,
    date,
    year,
  });

  return redirect(`/years/${year}/statements/${statement.id}`);
};

export default function NewStatementPage() {
  const actionData = useActionData<typeof action>();
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.date) {
      dateRef.current?.focus();
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
          <span>Select a date: </span>
          <input
            type="date"
            id="datepicker"
            name="date"
            className="max-w-32"
            ref={dateRef}
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
