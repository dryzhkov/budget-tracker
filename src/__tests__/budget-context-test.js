import { BudgetContext } from '../components/budget-context';
import { getCurrentPayDate, PayDate } from '../common/Utils';

test("BudgetContext returns current paydate on load", () => {
    const paydate = BudgetContext.getSelectedPayDay();
    expect(paydate).toEqual(getCurrentPayDate());
});

test("BudgetContext sets selected date correctly", () => {
    let paydate = getCurrentPayDate();

    BudgetContext.setSelectedPayDate(paydate);
    expect(BudgetContext.getSelectedPayDay()).toEqual(paydate);

    paydate = new PayDate(2019, 1);
    BudgetContext.setSelectedPayDate(paydate);
    expect(BudgetContext.getSelectedPayDay()).toEqual(paydate);
});