import type { Invoice } from "@prisma/client";
import { ActionFunctionArgs, TypedResponse } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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
    <Form method="post" className="flex w-full max-w-lg flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="Enter a title"
          defaultValue={invoice?.title ?? ""}
          ref={titleRef}
          aria-invalid={actionData?.errors?.date ? true : undefined}
          aria-errormessage={
            actionData?.errors?.date ? "date-error" : undefined
          }
        />
        {actionData?.errors?.date ? (
          <p className="text-sm text-destructive" id="title-error">
            {actionData.errors.date}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          defaultValue={invoice?.category ?? ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="saving">Saving</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <select
          id="frequency"
          name="frequency"
          defaultValue={invoice?.frequency ?? ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="bi-weekly">Bi Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="bi-monthly">Bi Monthly</option>
          <option value="quaterly">Quaterly</option>
          <option value="one-off">One Off</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <select
          id="state"
          name="state"
          defaultValue={invoice?.state ?? ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">External URL</Label>
        <Input
          type="text"
          id="url"
          name="url"
          defaultValue={invoice?.externalUrl ?? ""}
          placeholder="Enter a url"
        />
      </div>

      <div className="flex justify-end gap-2">
        {invoice ? (
          <Button type="submit" name="intent" value="delete" variant="destructive">
            Delete
          </Button>
        ) : null}
        <Button type="submit" name="intent" value="save">
          Save
        </Button>
      </div>
    </Form>
  );
}
