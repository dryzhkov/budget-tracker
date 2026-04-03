import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>New Statement</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method="post" className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="datepicker">Select a date</Label>
            <Input
              type="date"
              id="datepicker"
              name="date"
              ref={dateRef}
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

          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
