import React from 'react';
import * as _ from 'lodash';

import { formatAsCurrency, formatPayDate, stringToPayDate } from '../common/Utils';
 
import {
  Table,
  TableBody,
  TableFooter,
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
    if (categoriesAsCols) {
      this.convertToCategories(this.state.rawTransactions);
    } else {
      this.convertToPayDates(this.state.rawTransactions);
    }
  }

  convertToPayDates(transactions) {
    const tableData = {
      rows: [],
      headers: []
    };
    const uniqCategories = _.uniqBy(transactions, 'category').map(el => el.category).sort();
    const uniqPayDates = _.uniqBy(transactions, 'payDate').map(el => el.payDate);

    tableData.headers.push('Expenses');
    tableData.headers = tableData.headers.concat(uniqPayDates.map(date => formatPayDate(stringToPayDate(date))));
    uniqCategories.forEach(category => {
      let row = [];
      row.push(category);
      uniqPayDates.forEach(payDate => {
        let curTransaction = _.find(transactions, (t) => { 
          return t.category === category && t.payDate === payDate;
        });
        row.push(curTransaction ? formatAsCurrency(curTransaction.amount) : '-');
      });

      tableData.rows.push(row);
    });

    this.setState({tableHeaders: tableData.headers, tableRows: tableData.rows});
  }

  convertToCategories(transactions) {
    let headers = [];
    let rows = [];
    const uniqCategories = _.uniqBy(transactions, 'category').map(el => el.category).sort();
    const uniqPayDates = _.uniqBy(transactions, 'payDate').map(el => el.payDate);
    headers.push('Pay Date');
    uniqCategories.forEach(category => headers.push(category));

    uniqPayDates.forEach(payDate => {
      let row = [];
      row.push(formatPayDate(stringToPayDate(payDate)));
      uniqCategories.forEach(category => {
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
      let rows = [];
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