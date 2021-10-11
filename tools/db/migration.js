const mongodb = require('./mongo');
const q = require('faunadb').query;
const moment = require('moment');

const { client: faunadbClient } = require('./faunadb');

console.log('Connecting to mongodb');
mongodb.connect();

const Transaction = mongodb.Transaction;

async function getTransactionsFromMongo(targetYear) {
  const transactions = await Transaction.find({
    payDate: { $regex: `${targetYear}-.*` },
  });
  console.log(`Found ${transactions.length} transations in ${targetYear}.`);

  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');
  const savings = transactions.filter((t) => t.type === 'saving');

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
            title: income.category,
            amount: income.amount,
          },
        ],
      };
    } else {
      paychecks[income.payDate].income.push({
        title: income.category,
        amount: income.amount,
      });
    }
  });

  return {
    paychecks: Object.values(paychecks),
    expenses,
    savings,
    transactions,
  };
}

async function savePaychecks(paychecks) {
  for (const paycheck of paychecks) {
    console.log(`creating paycheck...`, paycheck);
    try {
      await faunadbClient.query(
        q.Create(q.Collection('Paychecks'), { data: paycheck })
      );
    } catch (error) {
      console.log('error', error);
    }
  }
}

async function saveExpenses(expenses) {
  for (const expense of expenses) {
    console.log(`creating expense...`, expense);
    try {
      await faunadbClient.query(
        q.Create(q.Collection('Expenses'), {
          data: { title: expense, active: true },
        })
      );
    } catch (error) {
      console.log('error', error);
    }
  }
}

function formatPayDate(payDateStr, format = 'YYYY-MM-DD') {
  const pieces = payDateStr.split('-');
  const payDate = {
    year: pieces[0],
    period: pieces[1],
  };

  let isLastInMonth = payDate.period % 2 === 0;
  let month = Math.ceil(0.5 * payDate.period) - 1; //0 - 11
  let date = isLastInMonth
    ? moment([payDate.year, month]).endOf('month')
    : moment([payDate.year, month, 15]);
  return date.format(format);
}

async function saveLedgerRecords(records) {
  for (const record of records) {
    try {
      console.log('record: ', record);
      const date = formatPayDate(record.payDate);
      const isSavings = record.type === 'saving';
      const paycheck = await faunadbClient.query(
        q.Get(q.Match(q.Index('paycheck_by_date'), date))
      );

      if (!paycheck.ref) {
        throw new Error('Invalid paycheck, existing...', paycheck);
      }

      const expense = !isSavings
        ? await faunadbClient.query(
            q.Get(q.Match(q.Index('expense_by_title'), record.category))
          )
        : null;

      if (!isSavings && !expense.ref) {
        throw new Error('Invalid paycheck, existing...', paycheck);
      }

      const ledger = {
        paycheckRef: paycheck.ref,
        amount: record.amount,
        expenseRef: !isSavings ? expense.ref : null,
        isSavings: isSavings,
      };

      console.log(`creating ledger record...`, ledger);
      try {
        await faunadbClient.query(
          q.Create(q.Collection('Ledger'), {
            data: ledger,
          })
        );
      } catch (error) {
        console.log('creating ledger record', error);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  console.log('total: ', records.length);
}

async function migrateData() {
  const years = [2018];
  const uniqueExpenses = {};
  for (const year of years) {
    const mongoData = await getTransactionsFromMongo(year);

    await savePaychecks(mongoData.paychecks);

    mongoData.expenses.forEach((expense) => {
      if (!uniqueExpenses[expense.category]) {
        uniqueExpenses[expense.category] = true;
      }
    });

    await saveLedgerRecords([...mongoData.expenses, ...mongoData.savings]);
  }

  // await saveExpenses(Object.keys(uniqueExpenses));
}

void migrateData();
