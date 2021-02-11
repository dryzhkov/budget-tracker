import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Summary from './Summary';
import { getCurrentPayDate } from '../common/Utils';

export default class SummaryPage extends Component {
  constructor(props) {
    super(props);
    const options = [];
    const currentYear = getCurrentPayDate().year;

    for (let i = currentYear; i >= 2017; i--) {
      options.push(<MenuItem value={i} key={i} primaryText={i} />);
    }

    this.state = {
      year: currentYear,
      options,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    this.setState({ year: value });
  }

  render() {
    return (
      <div>
        <DropDownMenu
          maxHeight={300}
          value={this.state.year}
          onChange={this.handleChange}
          selected
          style={{ fontWeight: 'bold', fontSize: '20px', float: 'right' }}
          menuStyle={{ backgroundColor: '#fafafa' }}
          menuItemStyle={{ color: '#000' }}
        >
          {this.state.options}
        </DropDownMenu>
        <Summary
          years={[this.state.year]}
          categoriesAsCols={true}
          hideToggle={false}
        ></Summary>
      </div>
    );
  }
}
