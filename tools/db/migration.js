const mongodb = require("./mongo");
const q = require("faunadb").query;
const moment = require("moment");

const { client: faunadbClient } = require("./faunadb");

console.log("Connecting to mongodb");
mongodb.connect();

const Transaction = mongodb.Transaction;

async function getTransactionsFromMongo(targetYear) {
  const transactions = await Transaction.find({
    payDate: { $regex: `${targetYear}-.*` },
  });
  console.log(`Found ${transactions.length} transations in ${targetYear}.`);

  const incomes = transactions.filter((t) => t.type === "income");
  const expenses = transactions.filter((t) => t.type === "expense");
  const savings = transactions.filter((t) => t.type === "saving");

  console.log(`incomes: ${incomes.length}`);
  console.log(`expenses: ${expenses.length}`);
  console.log(`savings: ${savings.length}`);

  const paychecks = {};

  incomes.forEach((income) => {
    if (!paychecks[income.payDate]) {
      paychecks[income.payDate] = {
        date: income.created.toISOString().substr(0, 10),
        income: [
          {
            category: income.category,
            amount: income.amount,
          },
        ],
      };
    } else {
      paychecks[income.payDate].income.push({
        category: income.category,
        amount: income.amount,
      });
    }
  });

  Object.keys(paychecks).forEach((payDate) => {
    const filterredExpenses = expenses.filter((e) => e.payDate === payDate);
    const filterredSavings = savings.filter((e) => e.payDate === payDate);
    paychecks[payDate] = {
      ...paychecks[payDate],
      expenses: filterredExpenses,
      savings: filterredSavings,
    };
  });

  return {
    incomes,
    paychecks: Object.values(paychecks),
    expenses,
    savings,
    transactions,
  };
}

async function saveStatements(paychecks) {
  for (const paycheck of paychecks) {
    const statement = {
      date: paycheck.date,
      year: paycheck.date.substring(0, 4),
    };
    console.log(`creating statement...`, statement);
    try {
      await faunadbClient.query(
        q.Create(q.Collection("Statement"), { data: statement })
      );
    } catch (error) {
      console.log("error", error);
    }
  }
}

async function saveCategories(categories) {
  for (const category of categories) {
    console.log(`creating category...`, category);
    try {
      await faunadbClient.query(
        q.Create(q.Collection("Category"), {
          data: category,
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  }
}

function formatPayDate(payDateStr, format = "YYYY-MM-DD") {
  const pieces = payDateStr.split("-");
  const payDate = {
    year: pieces[0],
    period: pieces[1],
  };

  let isLastInMonth = payDate.period % 2 === 0;
  let month = Math.ceil(0.5 * payDate.period) - 1; //0 - 11
  let date = isLastInMonth
    ? moment([payDate.year, month]).endOf("month")
    : moment([payDate.year, month, 15]);
  return date.format(format);
}

async function saveTransactions(records) {
  for (const record of records) {
    try {
      const statement = await faunadbClient.query(
        q.Get(q.Match(q.Index("statementByDate"), record.date))
      );

      if (!statement.ref) {
        throw new Error("Invalid statement, existing...", statement);
      }

      const items = [...record.income, ...record.expenses, ...record.savings];

      for (const item of items) {
        const category = await faunadbClient.query(
          q.Get(q.Match(q.Index("categoryByTitle"), item.category))
        );

        if (!category.ref) {
          throw new Error("Invalid paycheck, existing...", category);
        }

        const transaction = {
          statementRef: statement.ref,
          amount: item.amount,
          categoryRef: category.ref,
        };

        console.log(`creating transaction...`, record.date, transaction);
        try {
          const result = await faunadbClient.query(
            q.Create(q.Collection("Transaction"), {
              data: transaction,
            })
          );

          // update statements

          await faunadbClient.query(
            q.Update(statement.ref, {
              data: {
                transactions: [result.ref],
              },
            })
          );
        } catch (error) {
          console.log("creating transaction failed", error);
        }

        return;
      }
    } catch (error) {
      console.log("error: ", error);
    }

    return;
  }

  console.log("total: ", records.length);
}

async function migrateData() {
  const years = [2021];
  // const uniqueCategories = {};
  for (const year of years) {
    const mongoData = await getTransactionsFromMongo(year);
    // console.log(mongoData.paychecks);
    await saveTransactions(mongoData.paychecks);
    // await savePaychecks(mongoData.paychecks);

    // mongoData.expenses.forEach((expense) => {
    //   if (!uniqueCategories[expense.category]) {
    //     uniqueCategories[expense.category] = "expense";
    //   }
    // });

    // mongoData.expenses.forEach((expense) => {
    //   if (!uniqueCategories[expense.category]) {
    //     uniqueCategories[expense.category] = "expense";
    //   }
    // });

    // mongoData.savings.forEach((expense) => {
    //   if (!uniqueCategories[expense.category]) {
    //     uniqueCategories[expense.category] = "saving";
    //   }
    // });

    // mongoData.incomes.forEach((expense) => {
    //   if (!uniqueCategories[expense.category]) {
    //     uniqueCategories[expense.category] = "income";
    //   }
    // });

    // await saveStatements(mongoData.paychecks);
  }

  // const categories = Object.keys(uniqueCategories).map((k) => {
  //   return {
  //     title: k,
  //     type: uniqueCategories[k].toUpperCase(),
  //     archived: false,
  //   };
  // });

  // console.log(categories, categories.length);

  // await saveCategories(categories);
}

void migrateData();
