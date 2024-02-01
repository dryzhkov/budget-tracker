import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getInvoice } from "~/models/invoice.server";
import { requireUserId } from "~/session.server";
import { formatCurrency, formatDate } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const invoiceId = Number(params.invoiceId);
  const invoice = await getInvoice({ id: invoiceId, userId });

  if (!invoice) {
    throw new Response("Invoice does not exist", {
      status: 404,
    });
  }

  return json({ invoice });
};

const classes = "rounded-full text-blue-500 border-blue-500 border-2 p-2";

export default function InvoiceListPage() {
  const { invoice } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">Invoice Overview</h1>
        <div className="flex items-center space-x-4">
          <div className={classes}>Title: {invoice.title}</div>
          <div className={classes}>Category: {invoice.category}</div>
          <div className={classes}>State: {invoice.state}</div>
          <div className={classes}>Frequency: {invoice.frequency}</div>
          <div className="rounded-full text-blue-500 border-blue-500 border-2 p-2">
            Total Transactions: {invoice.Transaction.length}
          </div>
          <div>
            <Link
              to={`/invoices/${invoice.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded"
            >
              Edit Invoice
            </Link>
          </div>
        </div>
      </div>
      {invoice.Transaction.length ? (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
          <table className="min-w-full border bg-white">
            <thead>
              <tr>
                <th className="border p-4">Statement Date</th>
                <th className="border p-4">Amount</th>
                <th className="border p-4">Created Date</th>
                <th className="border p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoice.Transaction.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border p-4">
                    {formatDate(transaction.Statement.date)}
                  </td>
                  <td className="border p-4">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="border p-4">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="border p-4">
                    <Link
                      to={`/years/${transaction.Statement.year}/statements/${transaction.Statement.id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      View Statement
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
