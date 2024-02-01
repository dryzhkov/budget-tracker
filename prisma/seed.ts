import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "dima@dimaryz.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("awesomo", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      title: "Salary",
      category: "income",
    },
  });

  // first statment
  let statement = await prisma.statement.create({
    data: {
      date: new Date("2023-12-30"),
      year: 2023,
      userId: user.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 5000,
      statementId: statement.id,
      invoiceId: invoice.id,
    },
  });

  // second statment
  statement = await prisma.statement.create({
    data: {
      date: new Date("2023-12-15"),
      year: 2023,
      userId: user.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 5001,
      statementId: statement.id,
      invoiceId: invoice.id,
    },
  });

  // third statment
  statement = await prisma.statement.create({
    data: {
      date: new Date("2024-01-15"),
      year: 2024,
      userId: user.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 5002,
      statementId: statement.id,
      invoiceId: invoice.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
