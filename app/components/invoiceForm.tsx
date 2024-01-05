import type { Invoice } from "@prisma/client";
import { ActionFunctionArgs, TypedResponse } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
interface InvoiceFormProps {
  action: ({ request }: ActionFunctionArgs) => Promise<
    TypedResponse<{
      errors: {
        body: null;
        date: string;
      };
    }>
  >;
  invoice?: Invoice;
}

export function InvoiceForm({ action, invoice }: InvoiceFormProps) {
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
            defaultValue={invoice?.title ?? ""}
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
            defaultValue={invoice?.category ?? ""}
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
            defaultValue={invoice?.frequency ?? ""}
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
            defaultValue={invoice?.state ?? ""}
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
            defaultValue={invoice?.externalUrl ?? ""}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            placeholder="Enter a url"
          />
        </label>
      </div>

      <div className="text-right">
        {invoice ? (
          <>
            <button
              type="submit"
              name="intent"
              value="delete"
              className="rounded bg-red-500 px-4 py-2 mr-4 text-white hover:bg-red-600 focus:bg-red-400"
            >
              Delete
            </button>
          </>
        ) : null}
        <button
          type="submit"
          name="intent"
          value="save"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
