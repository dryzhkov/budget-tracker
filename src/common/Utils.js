import * as moment from 'moment';

function PayDate(year, period) {
  this.year = year;
  this.period = period;
}

PayDate.prototype.toString = function () {
  return `${this.year}-${this.period}`;
}

function stringToPayDate(value) {
  const pieces = value.split('-');
  return new PayDate(pieces[0], pieces[1]);
}

function calculateBudget(transactions) {
  let incomeSum = 0, expenseSum = 0, savingSum = 0;

  transactions.forEach(element => {
    let transAmount = Number.parseFloat(element.amount);
    if (element.type === 'income') {
      incomeSum += transAmount;
    } else if (element.type === 'expense') {
      expenseSum += transAmount;
    } else if (element.type === 'saving') {
      savingSum += transAmount;
    }
  });

  return {
    totalIncome: incomeSum,
    totalExpense: expenseSum,
    totalSaving: savingSum
  };
}

function formatAsCurrency(amount) {
  if (typeof amount !== 'number') {
    try {
      amount = Number.parseFloat(amount);
    } catch (e) {
      amount = 0.0;
    }
  }
  return `$${amount.format(2)}`;
}

function getCurrentPayDate() {
  let currentDate = moment();
  let dayOfMonth = currentDate.date();
  let year = currentDate.year();
  let period = Math.ceil(2 * currentDate.month()) + Math.ceil(dayOfMonth / 15); // 15 is because of semi-monthly pay periods

  return new PayDate(year, period);
}

function formatPayDate(payDate) {
  if (!payDate || !payDate.year || !payDate.period) {
    throw Error('invalid pay date: ' + payDate);
  }

  let isLastInMonth = payDate.period % 2 === 0;
  let month = Math.ceil(0.5 * payDate.period) - 1; //0 - 11
  let date = isLastInMonth ? 
              moment([payDate.year, month]).endOf('month') :
              moment([payDate.year, month, 15]);
  return date.format("MMM Do, YYYY");
}

export { 
  calculateBudget,
  formatAsCurrency,
  formatPayDate,
  getCurrentPayDate,
  stringToPayDate
};