import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getInvoices } from "~/models/invoice";
import {
  deleteStatement,
  getStatementWithTransactions,
} from "~/models/statement";
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

  console.log("statement", statement);
  if (statement.transactions.length > 0) {
    console.log("invoice", statement.transactions[0].invoice);
  }

  const invoices = await getInvoices(userId);

  console.log("invoices", invoices);

  return json({ statement, invoices });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.statementId, "statementId not found");

  await deleteStatement({ id: Number(params.statementId), userId });

  return redirect(`/years/${params.year}/statements`);
};

enum PageGroup {
  INCOME = "Income",
  EXPENSE = "Expense",
  SAVING = "Saving",
  TOTAL = "Total",
}

const groups: { group: PageGroup; bgColorCSS: string }[] = [
  {
    group: PageGroup.INCOME,
    bgColorCSS: "bg-green-100",
  },
  {
    group: PageGroup.EXPENSE,
    bgColorCSS: "bg-red-100",
  },
  {
    group: PageGroup.SAVING,
    bgColorCSS: "bg-yellow-100",
  },
  {
    group: PageGroup.TOTAL,
    bgColorCSS: "bg-blue-100",
  },
];
export default function StatementDetailsPage() {
  const { statement, invoices } = useLoaderData<typeof loader>();
  const { transactions } = statement;

  const getTransactions = (group: string) => {
    const filtered = transactions.filter(
      (item) => item.invoice.category === group.toLowerCase(),
    );
    let total = 0;
    let list: React.ReactElement[] = [];
    if (filtered.length > 0) {
      list = filtered.map((transaction) => {
        total += Number(transaction.amount);
        return (
          <li key={transaction.id}>
            <span>{transaction.invoice.title}</span>{" "}
            <span className="float-right">
              {formatCurrency(transaction.amount)}
            </span>
          </li>
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
        <h3 className="text-2xl font-bold">
          Statement Date: {formatDate(statement.date)}
        </h3>
        <p className="py-6">
          {transactions.length === 0 ? (
            "No transactions yet"
          ) : (
            <ol className="space-y-4 text-gray-500 list-none list-inside dark:text-gray-400">
              {groups.map((item, index) => {
                const { group, bgColorCSS } = item;

                if (group !== PageGroup.TOTAL) {
                  const { list, total } = getTransactions(group.toLowerCase());
                  grandTotal += total;
                  return (
                    <li key={index}>
                      <div className={`font-bold ${bgColorCSS} px-2 py-1`}>
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
                      <div className={`font-bold ${bgColorCSS} px-2 py-1`}>
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
        </p>
        <hr className="my-4" />
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Delete
          </button>
        </Form>
      </div>
      <div className="max-w-sm ml-5">
        <div className="btn-group">
          {invoices.map((invoice) => {
            return (
              <button
                className="bg-green-400 text-white px-4 py-2"
                key={invoice.id}
              >
                {invoice.title}
              </button>
            );
          })}
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
