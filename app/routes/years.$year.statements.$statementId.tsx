import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { Check, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";

import { Spinner } from "~/components/spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { prisma } from "~/db.server";
import { cn } from "~/lib/utils";
import { getInvoices } from "~/models/invoice.server";
import {
  deleteStatement,
  getStatementWithTransactions,
} from "~/models/statement.server";
import {
  createTransaction,
  deleteTransaction,
  updateTransactionAmount,
} from "~/models/transaction.server";
import { requireUserId } from "~/session.server";
import { formatCurrency, formatDate } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.statementId, "statementId not found");

  const statement = await getStatementWithTransactions({
    id: Number(params.statementId),
    userId,
  });
  if (!statement) {
    throw new Response("Not Found", { status: 404 });
  }

  const invoices = await getInvoices(userId, "active");

  return json({ statement, invoices });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.statementId, "statementId not found");

  const formData = await request.formData();
  const intent = formData.get("intent");
  if (
    !(
      intent === "add" ||
      intent === "deleteStatement" ||
      intent === "update" ||
      intent === "deleteTransaction"
    )
  ) {
    throw new Response(`The intent ${intent} is not supported`, {
      status: 400,
    });
  }

  const statementId = Number(params.statementId);
  const statement = await prisma.statement.findUnique({
    where: { id: statementId },
  });

  if (!statement) {
    throw new Response("Statement does not exist", {
      status: 404,
    });
  }

  if (statement.userId !== userId) {
    throw new Response("User not authorized to modify this statement", {
      status: 403,
    });
  }
  if (intent === "deleteStatement") {
    await deleteStatement({ id: statementId, userId });
    return redirect(`/years/${params.year}/statements`);
  } else {
    const amount = Number(formData.get("amount"));
    if (isNaN(amount)) {
      throw new Response(`Invalid amount.`, {
        status: 400,
      });
    }

    if (intent === "add") {
      const invoiceId = Number(formData.get("invoiceId"));
      if (isNaN(invoiceId)) {
        throw new Response(`Invalid invoice.`, {
          status: 400,
        });
      }
      await createTransaction({
        statementId,
        invoiceId,
        amount: new Prisma.Decimal(amount),
      });
    } else {
      const transactionId = Number(formData.get("transactionId"));
      if (isNaN(transactionId)) {
        throw new Response(`Invalid transaction.`, {
          status: 400,
        });
      }

      if (intent === "deleteTransaction") {
        await deleteTransaction({ id: transactionId });
      } else {
        await updateTransactionAmount({
          id: transactionId,
          amount: new Prisma.Decimal(amount),
        });
      }
    }

    return json({ ok: true });
  }
};

enum PageGroup {
  INCOME = "Income",
  EXPENSE = "Expense",
  SAVING = "Saving",
  TOTAL = "Total",
}

const groups: {
  group: PageGroup;
  bgColor: string;
  darkBgColor: string;
}[] = [
  {
    group: PageGroup.INCOME,
    bgColor: "bg-green-100",
    darkBgColor: "dark:bg-green-900/30",
  },
  {
    group: PageGroup.EXPENSE,
    bgColor: "bg-red-100",
    darkBgColor: "dark:bg-red-900/30",
  },
  {
    group: PageGroup.SAVING,
    bgColor: "bg-yellow-100",
    darkBgColor: "dark:bg-yellow-900/30",
  },
  {
    group: PageGroup.TOTAL,
    bgColor: "bg-blue-100",
    darkBgColor: "dark:bg-blue-900/30",
  },
];

function InlineEditRow({
  transaction,
}: {
  transaction: { id: number; amount: string | number; invoice: { title: string } };
}) {
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = fetcher.state !== "idle";

  if (editing) {
    return (
      <li className="flex items-center gap-1 rounded px-2 py-1">
        <span className="flex-1 truncate text-sm">
          {transaction.invoice.title}
        </span>
        <fetcher.Form
          method="post"
          className="flex items-center gap-1"
          onSubmit={() => setEditing(false)}
        >
          <input type="hidden" name="transactionId" value={transaction.id} />
          <Input
            ref={inputRef}
            type="number"
            name="amount"
            step=".01"
            min="0"
            defaultValue={Number(transaction.amount)}
            className="h-7 w-24 text-right text-sm"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <Button
            type="submit"
            name="intent"
            value="update"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={isSubmitting}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="submit"
            name="intent"
            value="deleteTransaction"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            disabled={isSubmitting}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setEditing(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </fetcher.Form>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setEditing(true)}
        className="flex w-full items-center rounded px-2 py-1 text-sm transition-colors hover:bg-accent"
      >
        <span className="flex-1 truncate text-left">
          {transaction.invoice.title}
        </span>
        <span className="tabular-nums">
          {formatCurrency(transaction.amount)}
        </span>
      </button>
    </li>
  );
}

function InlineAddRow({
  invoice,
  bgColor,
  darkBgColor,
}: {
  invoice: {
    id: number;
    title: string;
    category: string;
    frequency: string;
    Transaction: { amount: string | number; Statement: { date: string } }[];
  };
  bgColor: string;
  darkBgColor: string;
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  const lastTx = invoice.Transaction[0];

  return (
    <fetcher.Form method="post" className="flex items-center gap-2 py-0.5">
      <input type="hidden" name="invoiceId" value={invoice.id} />
      <input type="hidden" name="intent" value="add" />
      <span
        className={cn(
          "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
          bgColor,
          darkBgColor,
        )}
      >
        {invoice.title}
        {invoice.category === "expense" ? (
          <span className="ml-1 text-muted-foreground">
            ({invoice.frequency})
          </span>
        ) : null}
      </span>
      {lastTx ? (
        <span className="hidden text-xs text-muted-foreground sm:inline">
          last {formatCurrency(lastTx.amount)}
        </span>
      ) : null}
      <div className="ml-auto flex items-center gap-1">
        <Input
          type="number"
          name="amount"
          step=".01"
          min="0"
          placeholder={lastTx ? String(Number(lastTx.amount)) : "0.00"}
          className="h-7 w-24 text-right text-sm"
        />
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          className="h-7 px-2 text-xs"
          disabled={isSubmitting}
        >
          Add
        </Button>
      </div>
    </fetcher.Form>
  );
}

export default function StatementDetailsPage() {
  const { statement, invoices } = useLoaderData<typeof loader>();
  const { transactions } = statement;

  const navigation = useNavigation();
  const existingInvoices = new Set<number>();

  const getTransactions = (group: string) => {
    const filtered = transactions.filter(
      (item) => item.invoice.category === group.toLowerCase(),
    );

    let total = 0;
    const list = filtered.map((transaction) => {
      total += Number(transaction.amount);
      existingInvoices.add(transaction.invoice.id);
      return <InlineEditRow key={transaction.id} transaction={transaction} />;
    });

    return { list, total };
  };

  let grandTotal = 0;

  if (navigation.state === "loading") {
    return <Spinner />;
  }

  // Build unassigned invoices grouped by category
  const getUnassignedByCategory = (category: string) => {
    return invoices.filter(
      (inv) =>
        inv.category === category && !existingInvoices.has(inv.id),
    );
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="text-lg font-bold">
        Statement Date: {formatDate(statement.date)}
      </h3>

      {/* Existing transactions */}
      {transactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions yet</p>
      ) : (
        <ol className="list-none space-y-3">
          {groups.map((item, index) => {
            const { group, bgColor, darkBgColor } = item;

            if (group !== PageGroup.TOTAL) {
              const { list, total } = getTransactions(group.toLowerCase());
              if (group === PageGroup.INCOME) {
                grandTotal += total;
              } else {
                grandTotal -= total;
              }
              return (
                <li key={index}>
                  <div
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-bold",
                      bgColor,
                      darkBgColor,
                    )}
                  >
                    {group}
                    <span className="float-right tabular-nums">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <ul className="mt-0.5 list-none">{list}</ul>
                </li>
              );
            } else {
              return (
                <li key={index}>
                  <div
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-bold",
                      bgColor,
                      darkBgColor,
                    )}
                  >
                    {group}
                    <span className="float-right tabular-nums">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </li>
              );
            }
          })}
        </ol>
      )}

      {/* Unassigned invoices - inline add */}
      {(() => {
        const unassigned = invoices.filter(
          (inv) => !existingInvoices.has(inv.id),
        );
        if (unassigned.length === 0) return null;

        return (
          <>
            <Separator />
            <div>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                Add Transactions
              </h4>
              <div className="space-y-1">
                {groups
                  .filter((g) => g.group !== PageGroup.TOTAL)
                  .flatMap((item) =>
                    getUnassignedByCategory(item.group.toLowerCase()).map(
                      (invoice) => (
                        <InlineAddRow
                          key={invoice.id}
                          invoice={invoice}
                          bgColor={item.bgColor}
                          darkBgColor={item.darkBgColor}
                        />
                      ),
                    ),
                  )}
              </div>
            </div>
          </>
        );
      })()}

      <Separator />
      <Form method="post">
        <Button
          type="submit"
          name="intent"
          value="deleteStatement"
          variant="destructive"
          size="sm"
        >
          Delete Statement
        </Button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Statement not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
