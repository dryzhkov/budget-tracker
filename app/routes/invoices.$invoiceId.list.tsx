import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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

export default function InvoiceListPage() {
  const { invoice } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Invoice Overview</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{invoice.title}</Badge>
          <Badge variant="outline">{invoice.category}</Badge>
          <Badge variant="outline">{invoice.state}</Badge>
          <Badge variant="outline">{invoice.frequency}</Badge>
          <Badge variant="secondary">
            {invoice.Transaction.length} transactions
          </Badge>
          <Button size="sm" asChild>
            <Link to={`/invoices/${invoice.id}/edit`}>Edit Invoice</Link>
          </Button>
        </div>
      </div>

      {invoice.Transaction.length ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Statement Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.Transaction.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {formatDate(transaction.Statement.date)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to={`/years/${transaction.Statement.year}/statements/${transaction.Statement.id}`}
                        >
                          View Statement
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
