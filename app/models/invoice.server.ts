import type { Invoice, User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getInvoices(userId: User["id"], state?: string) {
  return prisma.invoice.findMany({
    where: {
      userId,
      state,
    },
    select: {
      id: true,
      title: true,
      category: true,
      frequency: true,
    },
  });
}

export function createInvoice({
  userId,
  title,
  category,
  frequency,
  state,
  externalUrl,
}: Omit<Invoice, "id" | "userId"> & {
  userId: User["id"];
}) {
  return prisma.invoice.create({
    data: {
      userId,
      title,
      category,
      frequency,
      state,
      externalUrl,
    },
  });
}

export function updateInvoice({
  id,
  userId,
  title,
  category,
  frequency,
  state,
  externalUrl,
}: Omit<Invoice, "userId"> & {
  userId: User["id"];
}) {
  return prisma.invoice.update({
    where: { id },
    data: {
      userId,
      title,
      category,
      frequency,
      state,
      externalUrl,
    },
  });
}

export function deleteInvoice({
  id,
  userId,
}: Pick<Invoice, "id"> & { userId: User["id"] }) {
  return prisma.invoice.deleteMany({
    where: { id, userId },
  });
}

export function getInvoice({
  id,
  userId,
}: Pick<Invoice, "id"> & { userId: User["id"] }) {
  return prisma.invoice.findFirst({
    where: { id, userId },
  });
}