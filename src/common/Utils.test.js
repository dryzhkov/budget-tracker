import * as Utils from './Utils';

describe('Utils: getCurrentPayDate', () => {
  it('it returns a valid pay date', () => {
    const payDate = Utils.getCurrentPayDate();
    console.log(payDate);
  });
});
