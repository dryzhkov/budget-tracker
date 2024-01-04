import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getInvoices(userId: User["id"], state = "active") {
  return prisma.invoice.findMany({
    distinct: ["title"],
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
