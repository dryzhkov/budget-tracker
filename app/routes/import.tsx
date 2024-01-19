import { Invoice, Prisma } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { createInvoice, getInvoiceByTitle } from "~/models/invoice.server";
import {
  createStatement,
  findStatementByDate,
} from "~/models/statement.server";
import { createTransaction } from "~/models/transaction.server";
import { requireUserId } from "~/session.server";

import { legacyCategories } from "./backup/categories";
import { statements as statements2018 } from "./backup/statements_2018";
import { statements as statements2019 } from "./backup/statements_2019";
import { statements as statements2020 } from "./backup/statements_2020";
import { statements as statements2021 } from "./backup/statements_2021";
import { statements as statements2022 } from "./backup/statements_2022";
import { statements as statements2023 } from "./backup/statements_2023";
import { statements as statements2024 } from "./backup/statements_2024";

function mapFrequence(input: string) {
  switch (input) {
    case "BIWEEKLY":
      return "bi-weekly";
    case "BIMONTLY":
      return "bi-monthly";
    case "QUARTERLY":
      return "quaterly";
    case "MONTHLY":
      return "monthly";
    default:
      return "one-off";
  }
}

function convertInvoices(): Pick<
  Invoice,
  "title" | "category" | "state" | "frequency" | "externalUrl"
>[] {
  return legacyCategories.map((category) => {
    return {
      title: category.title,
      category: category.type.toLowerCase(),
      state: category.archived ? "archived" : "active",
      frequency: mapFrequence(category.paymentFrequency ?? ""),
      externalUrl: category.externalUrl,
    };
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const messages: string[] = [];
  const importedInvoices = convertInvoices();

  for (const invoice of importedInvoices) {
    const existing = await getInvoiceByTitle({ title: invoice.title, userId });

    if (existing) {
      messages.push(
        `EXISTING: invoice ${invoice.title} already exits, skiping`,
      );
    } else {
      messages.push(`NEW: invoice ${invoice.title} doesn't exits, creating it`);

      const { title, category, frequency, state, externalUrl } = invoice;
      await createInvoice({
        userId,
        title,
        category,
        frequency,
        state,
        externalUrl,
      });
    }
  }
  const years = [
    statements2018,
    statements2019,
    statements2020,
    statements2021,
    statements2022,
    statements2023,
    statements2024,
  ];
  for (const yearStatements of years) {
    for (const statement of yearStatements) {
      const existingStatement = await findStatementByDate({
        userId,
        date: new Date(statement.date),
      });

      if (!existingStatement) {
        const { id } = await createStatement({
          userId,
          date: new Date(statement.date),
          year: Number(statement.year),
        });

        if (statement.transactions.data.length) {
          for (const transaction of statement.transactions.data) {
            const invoice = await getInvoiceByTitle({
              title: transaction.category.title,
              userId,
            });

            if (invoice) {
              await createTransaction({
                statementId: id,
                invoiceId: invoice.id,
                amount: new Prisma.Decimal(transaction.amount),
              });
            }
          }
        }
      }
    }
  }

  return json({ status: "OK", messages });
};
