import { Transaction } from "@prisma/client";

import { prisma } from "~/db.server";

export function getTransaction({
  id,
  statementId,
}: Pick<Transaction, "id" | "statementId">) {
  return prisma.transaction.findFirst({
    where: { id, statementId },
  });
}

export function createTransaction({
  invoiceId,
  statementId,
  amount,
}: Pick<Transaction, "statementId" | "invoiceId" | "amount">) {
  return prisma.transaction.create({
    data: {
      statementId,
      invoiceId,
      amount,
    },
  });
}

export function updateTransactionAmount({
  id,
  amount,
}: Pick<Transaction, "id" | "amount">) {
  return prisma.transaction.update({
    where: {
      id,
    },
    data: {
      amount,
    },
  });
}

export function deleteTransaction({ id }: Pick<Transaction, "id">) {
  return prisma.transaction.delete({
    where: { id },
  });
}
