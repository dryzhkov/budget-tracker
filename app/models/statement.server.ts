import type { User, Statement } from "@prisma/client";

import { prisma } from "~/db.server";

export function getStatementWithTransactions({
  id,
  userId,
}: Pick<Statement, "id"> & {
  userId: User["id"];
}) {
  return prisma.statement.findFirst({
    select: {
      id: true,
      date: true,
      transactions: {
        select: {
          id: true,
          createdAt: true,
          invoiceId: true,
          amount: true,
          invoice: {
            select: {
              id: true,
              title: true,
              category: true,
              state: true,
              frequency: true,
              externalUrl: true,
            },
          },
        },
      },
    },
    where: { id, userId },
  });
}

export function getStatementListItems({
  userId,
  year,
}: Pick<Statement, "year"> & {
  userId: User["id"];
}) {
  return prisma.statement.findMany({
    where: { userId, year: { equals: year } },
    select: { id: true, date: true },
    orderBy: { date: "desc" },
  });
}

export function createStatement({
  userId,
  date,
  year,
}: Pick<Statement, "date" | "year"> & {
  userId: User["id"];
}) {
  return prisma.statement.create({
    data: {
      date,
      year,
      userId,
    },
  });
}

export function deleteStatement({
  id,
  userId,
}: Pick<Statement, "id"> & { userId: User["id"] }) {
  return prisma.statement.deleteMany({
    where: { id, userId },
  });
}

export function getStatementYears({ userId }: { userId: User["id"] }) {
  return prisma.statement.findMany({
    distinct: ["year"],
    where: {
      userId,
    },
    select: {
      year: true,
    },
    orderBy: { year: "desc" },
  });
}
