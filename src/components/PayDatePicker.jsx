import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import * as Utils from '../common/Utils';

class PayDatePicker extends Component {
  constructor(props) {
    super(props);
    this.menuItems = [];
    const payDate = Utils.getCurrentPayDate();

    this.state = {
      value: payDate.toString()
    }

    // populate dropdown 6 months in the past
    for (let i = 0; i < 12; i++ ) {
      const payDateFormatted = Utils.formatPayDate(payDate, "MMM Do, YYYY");
      this.menuItems.push(<MenuItem value={payDate.toString()} key={payDate.toString()} primaryText={payDateFormatted}/>)

      payDate.period--;

      if (payDate.period < 1) {
        payDate.period = 24;
        payDate.year--;
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) { 
    this.setState({value});
    this.props.onChange(Utils.stringToPayDate(value));
  };
  
  render() {
    return (
      <DropDownMenu maxHeight={300} value={this.state.value} onChange={this.handleChange} 
        style={{fontWeight:'bold', fontSize:'20px'}} menuStyle={{backgroundColor:'#fafafa'}} menuItemStyle={{color:'#000'}}>
        {this.menuItems}
      </DropDownMenu>
    );
  }
}

export default PayDatePicker;