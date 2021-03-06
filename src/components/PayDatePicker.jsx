import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { BudgetContext } from './budget-context';
import * as Utils from '../common/Utils';

class PayDatePicker extends Component {
  constructor(props) {
    super(props);
    this.menuItems = [];
    this.state = {
      value: BudgetContext.getSelectedPayDay().toString()
    };

    // populate dropdown 6 months in the past
    const curPayDate = Utils.getCurrentPayDate();
    for (let i = 0; i < 12; i++) {
      const payDateFormatted = Utils.formatPayDate(curPayDate, "MMM Do, YYYY");
      this.menuItems.push(<MenuItem value={curPayDate.toString()} key={curPayDate.toString()} primaryText={payDateFormatted} />)

      curPayDate.period--;

      if (curPayDate.period < 1) {
        curPayDate.period = 24;
        curPayDate.year--;
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    this.setState({ value });
    this.props.onChange(Utils.stringToPayDate(value));
  };

  render() {
    return (
      <DropDownMenu maxHeight={300} value={this.state.value} onChange={this.handleChange} selected
        style={{ fontWeight: 'bold', fontSize: '20px' }} menuStyle={{ backgroundColor: '#fafafa' }} menuItemStyle={{ color: '#000' }}>
        {this.menuItems}
      </DropDownMenu>
    );
  }
}

export default PayDatePicker;