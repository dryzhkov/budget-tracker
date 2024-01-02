import type { User, Statement } from "@prisma/client";

import { prisma } from "~/db.server";

export function getStatement({
  id,
  userId,
}: Pick<Statement, "id"> & {
  userId: User["id"];
}) {
  return prisma.statement.findFirst({
    select: { id: true, date: true },
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
