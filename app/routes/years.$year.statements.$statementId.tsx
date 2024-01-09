import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";
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

  const invoices = await getInvoices(userId);

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
        // update transaction amount
        await updateTransactionAmount({
          id: transactionId,
          amount: new Prisma.Decimal(amount),
        });
      }
    }

    return redirect(".");
  }
};

enum PageGroup {
  INCOME = "Income",
  EXPENSE = "Expense",
  SAVING = "Saving",
  TOTAL = "Total",
}

const groups: { group: PageGroup; bgColor: string; hoverBgColor: string }[] = [
  {
    group: PageGroup.INCOME,
    bgColor: "bg-green-100",
    hoverBgColor: "hover:bg-green-200",
  },
  {
    group: PageGroup.EXPENSE,
    bgColor: "bg-red-100",
    hoverBgColor: "hover:bg-red-200",
  },
  {
    group: PageGroup.SAVING,
    bgColor: "bg-yellow-100",
    hoverBgColor: "hover:bg-yellow-200",
  },
  {
    group: PageGroup.TOTAL,
    bgColor: "bg-blue-100",
    hoverBgColor: "hover:bg-blue-200",
  },
];
export default function StatementDetailsPage() {
  const { statement, invoices } = useLoaderData<typeof loader>();
  const { transactions } = statement;
  const [invoice, setInvoice] = useState<(typeof invoices)[0] | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [popupIntent, setPopupIntent] = useState<"add" | "update">("add");

  const existingInvoices = new Set<number>();

  const getTransactions = (group: string) => {
    const filtered = transactions.filter(
      (item) => item.invoice.category === group.toLowerCase(),
    );
    let total = 0;
    let list: React.ReactElement[] = [];
    if (filtered.length > 0) {
      list = filtered.map((transaction) => {
        total += Number(transaction.amount);
        existingInvoices.add(transaction.invoice.id);
        return (
          <button
            key={transaction.id}
            onClick={() => {
              setPopupVisible(true);
              setInvoice(transaction.invoice);
              setTransactionId(transaction.id);
              setTransactionAmount(Number(transaction.amount));
              setPopupIntent("update");
            }}
            className="cursor-pointer block w-full text-left"
          >
            <span>{transaction.invoice.title}</span>{" "}
            <span className="float-right mr-2">
              {formatCurrency(transaction.amount)}
            </span>
          </button>
        );
      });
    }
    return {
      list,
      total,
    };
  };
  let grandTotal = 0;

  return (
    <div className="flex">
      <div className="max-w-sm min-w-96">
        <h3 className="text-1xl font-bold">
          Statement Date: {formatDate(statement.date)}
        </h3>
        <div className="py-6">
          {transactions.length === 0 ? (
            "No transactions yet"
          ) : (
            <ol className="space-y-4 text-gray-500 list-none list-inside dark:text-gray-400">
              {groups.map((item, index) => {
                const { group, bgColor } = item;

                if (group !== PageGroup.TOTAL) {
                  const { list, total } = getTransactions(group.toLowerCase());
                  if (group === PageGroup.INCOME) {
                    grandTotal += total;
                  } else {
                    grandTotal -= total;
                  }
                  return (
                    <li key={index}>
                      <div className={`font-bold ${bgColor} px-2 py-1`}>
                        {group}{" "}
                        <span className="float-right">
                          {formatCurrency(total)}
                        </span>
                      </div>
                      <ul className="ps-5 mt-2 space-y-1 list-none list-inside">
                        {list}
                      </ul>
                    </li>
                  );
                } else {
                  return (
                    <li key={index}>
                      <div className={`font-bold ${bgColor} px-2 py-1`}>
                        {group}{" "}
                        <span className="float-right">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </li>
                  );
                }
              })}
            </ol>
          )}
        </div>
        <hr className="my-4" />
        <Form method="post">
          <button
            type="submit"
            name="intent"
            value="deleteStatement"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400"
          >
            Delete
          </button>
        </Form>
      </div>
      <div className="ml-5">
        <div className="flex space-x-4">
          {invoices.map((invoice) => {
            if (existingInvoices.has(invoice.id)) {
              return null;
            }

            const item =
              groups.filter(
                (item) => item.group.toLowerCase() === invoice.category,
              )[0] ?? {};
            const { bgColor, hoverBgColor } = item;

            return (
              <button
                className={`${bgColor} ${hoverBgColor} py-2 px-4 rounded text-gray-500 dark:text-gray-400`}
                key={invoice.id}
                onClick={() => {
                  setPopupVisible(true);
                  setInvoice(invoice);
                  setTransactionAmount(0);
                  setPopupIntent("add");
                  setTransactionId(null);
                }}
              >
                {invoice.title}
              </button>
            );
          })}
        </div>

        <div
          className={`${
            popupVisible ? undefined : "hidden"
          } fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center`}
        >
          <div className="bg-white p-8 rounded shadow-md w-96">
            <Form method="post">
              <h2>{invoice?.title ?? ""}</h2>
              <label htmlFor="amount">Amount:</label>
              <span>$</span>
              <input
                type="number"
                name="amount"
                min="0"
                value={transactionAmount}
                onChange={(ev) => setTransactionAmount(Number(ev.target.value))}
              />
              <input type="hidden" name="invoiceId" value={invoice?.id ?? ""} />
              <input
                type="hidden"
                name="transactionId"
                value={transactionId ?? undefined}
              />
              <hr className="my-4" />
              <button
                type="submit"
                name="intent"
                value={popupIntent}
                className="rounded mr-4 bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:bg-green-400"
                onClick={() => setPopupVisible(false)}
              >
                {popupIntent === "add" ? "Add" : "Update"}
              </button>
              <button
                type="submit"
                className="rounded  mr-4 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                onClick={(ev) => {
                  ev.preventDefault();
                  setInvoice(null);
                  setPopupVisible(false);
                  setTransactionAmount(0);
                  setTransactionId(null);
                }}
              >
                Close
              </button>
              <button
                type="submit"
                name="intent"
                value="deleteTransaction"
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400"
                onClick={() => setPopupVisible(false)}
              >
                Delete
              </button>
            </Form>
          </div>
        </div>
      </div>
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
