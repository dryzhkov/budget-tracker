
import { getCurrentPayDate } from '../common/Utils';
let selectedPayDate = getCurrentPayDate();

export const BudgetContext = {
    getSelectedPayDay: () => {
        return selectedPayDate;
    },
    setSelectedPayDate: (value) => {
        selectedPayDate = value;
    }
};