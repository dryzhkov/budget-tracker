const fetch = require("node-fetch");
const mongodb = require("./mongo");
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
    paychecks: Object.values(paychecks),
    incomes,
    expenses,
    savings,
    transactions,
  };
}

async function migrateData() {
  const years = [2021];
  for (const year of years) {
    const mongoData = await getTransactionsFromMongo(year);

    // TODO: filter existing categories before migrating the ones from previous years!!!
    // await saveCategories(mongoData);
    // await saveStatements(mongoData.paychecks);
  }
}

async function saveStatements(paychecks) {
  const results = await execQuery(`query {
    allCategories {
      data {
        _id,
        archived,
        title,
        type,
        _ts
      }
    }
  }`);

  console.log("Number of statements to create: " + paychecks.length);

  for (const paycheck of paychecks) {
    const records = [
      ...paycheck.income,
      ...paycheck.savings,
      ...paycheck.expenses,
    ];
    const statement = {
      date: paycheck.date,
      year: paycheck.date.substring(0, 4),
    };

    console.log("Number of transactions in a statement: " + records.length);

    const transactions = records.map((r) => {
      const category = results.allCategories.data.find(
        (c) => r.category === c.title
      );
      return `{
        amount: ${r.amount},
        category: {
          connect: "${category._id}",
        }
      }`;
    });

    const query = `mutation {
      createStatement(
        data: {
          year: "${statement.year}",
          date: "${statement.date}",
          transactions: {
            create: [
              ${transactions.join(",")}
            ]
          }
        }
      ) { _id }
    }
`;
    await execQuery(query);
  }
}

async function execQuery(query) {
  const results = await fetch("https://graphql.us.fauna.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization:
        "Basic Zm5BRVdWTkdVX0FBU1dETXdERG5KRGRMQjNFZzVnemxQTXh3Vkt6TDpidWRnZXQtdHJhY2tlcjphZG1pbg==",
    },
    body: JSON.stringify({
      query,
    }),
  });

  const body = await results.json();
  if (body.errors) {
    console.log(body.errors);
  }

  return body.data;
}

async function saveCategories(data) {
  const uniqueCategories = {};
  data.expenses.forEach((expense) => {
    if (!uniqueCategories[expense.category]) {
      uniqueCategories[expense.category] = "expense";
    }
  });

  data.savings.forEach((saving) => {
    if (!uniqueCategories[saving.category]) {
      uniqueCategories[saving.category] = "saving";
    }
  });

  data.incomes.forEach((income) => {
    if (!uniqueCategories[income.category]) {
      uniqueCategories[income.category] = "income";
    }
  });

  const categories = Object.keys(uniqueCategories).map((k) => {
    return {
      title: k,
      type: uniqueCategories[k].toUpperCase(),
      archived: false,
    };
  });

  for (const category of categories) {
    console.log(category);
    await execQuery(`mutation {
            createCategory(
              data: {
                title: "${category.title}"
                archived: false
                type: ${category.type}
              }  
            ) { _id }
          }
      `);
  }
}

void migrateData();
