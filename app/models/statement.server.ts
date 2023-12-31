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
  date,
}: {
  userId: User["id"];
  date: Date;
}) {
  return prisma.statement.findMany({
    where: { userId, date },
    select: { id: true, date: true },
    orderBy: { date: "desc" },
  });
}

export function createStatement({
  userId,
  date,
}: Pick<Statement, "date"> & {
  userId: User["id"];
}) {
  return prisma.statement.create({
    data: {
      date,
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
