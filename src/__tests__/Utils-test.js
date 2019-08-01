import { PayDate } from '../common/Utils';

test("PayDate.toString has correct format", () => {
    let paydate = new PayDate(2019, 25);
    expect(paydate.toString()).toEqual("2019-25");

    paydate = new PayDate(2019, 6);
    expect(paydate.toString()).toEqual("2019-6");
});