import React from 'react';
import * as _ from 'lodash';

import { formatAsCurrency, formatPayDate, stringToPayDate } from '../common/Utils';
 
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import TransactionRepo from '../repositories/TransactionRepo';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeaders: [],
      tableRows: [],
      year: props.match.params.year,
      categoriesAsCols: true
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillMount() {
    TransactionRepo.getAll(this.state.year)
      .then(results => {
        this.setState({rawTransactions: results});
        this.displayData(this.state.categoriesAsCols);
      });
    
  }

  displayData(categoriesAsCols) {
    const uniqCategories = _.uniqBy(this.state.rawTransactions, 'category').map(el => el.category).sort();
    const uniqPayDates = _.reverse(
      _.sortedUniq(
        _.sortBy(this.state.rawTransactions, 
          [
            (t) => { return parseInt(t.payDate.split('-')[1])}
          ]
        )
        .map(t => t.payDate)
      )
    );

    if (categoriesAsCols) {
      this.convertToCategories(this.state.rawTransactions, uniqPayDates, uniqCategories);
    } else {
      this.convertToPayDates(this.state.rawTransactions, uniqPayDates, uniqCategories);
    }
  }

  convertToPayDates(transactions, dates, categories) {
    let headers = [];
    let rows = [];

    headers.push('Expenses');
    headers = headers.concat(dates.map(date => formatPayDate(stringToPayDate(date), "MMM Do")));
    categories.forEach(category => {
      let row = [];
      row.push(category);
      dates.forEach(payDate => {
        let curTransaction = _.find(transactions, (t) => { 
          return t.category === category && t.payDate === payDate;
        });
        row.push(curTransaction ? formatAsCurrency(curTransaction.amount) : '-');
      });

      rows.push(row);
    });

    this.setState({tableHeaders: headers, tableRows: rows});
  }

  convertToCategories(transactions, dates, categories) {
    let headers = [];
    let rows = [];
    
    headers.push('Pay Date');
    headers = headers.concat(categories);

    dates.forEach(payDate => {
      let row = [];
      row.push(formatPayDate(stringToPayDate(payDate), "MMM Do"));
      categories.forEach(category => {
        let curTransaction = _.find(transactions, (t) => { 
          return t.category === category && t.payDate === payDate;
        });
        row.push(curTransaction ? formatAsCurrency(curTransaction.amount) : '-');
      });

      rows.push(row);
    });

    this.setState({tableHeaders: headers, tableRows: rows});
  }

  renderTableHeaders() {
    if (this.state.tableHeaders.length) {
      const colHeaders = [];
      this.state.tableHeaders.forEach((el, index) => {
        colHeaders.push(<TableHeaderColumn key={index} tooltip={el}>{el}</TableHeaderColumn>);
      });

      return <TableRow> 
              { colHeaders }
            </TableRow>;
    }
  }

  renderTableRows() {
    if (this.state.tableRows.length) {
      return this.state.tableRows.map((cols, index) => {
        let arr = [];
        cols.forEach((c, i) => {
          arr.push(<TableRowColumn key={i}>{c}</TableRowColumn>)
        });

        return <TableRow key={index}>
                { arr }
              </TableRow>
      });
    }
  }

  handleToggle(event, isInputChecked) {
    this.setState({
      categoriesAsCols: isInputChecked
    });

    this.displayData(isInputChecked);
  }

  render() {
    return (
      <div>
        <Toggle
          style={{margin: 0}}
          labelStyle={{color: '#B5D9EC'}}
          onToggle={this.handleToggle}
          toggled={this.state.categoriesAsCols}
        />
      <Paper zDepth={3} rounded={true} >
        <Table
          fixedHeader={true}
          selectable={true}
          multiSelectable={false}
          style={{fontFamily: "Comic Sans MS", height: "auto", maxHeight: '700px'}}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            { this.renderTableHeaders() }
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover={false}
            stripedRows={true}
            >
              { this.renderTableRows() }
          </TableBody>;
        </Table>
      </Paper>
      </div>
    );
  }
};

export default Summary;