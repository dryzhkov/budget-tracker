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
import TransactionRepo from '../repositories/TransactionRepo';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableHeaders: [],
      tableRows: [],
      year: props.match.params.year
    };
  }

  componentWillMount() {
    TransactionRepo.getAll(this.state.year)
      .then(results => {
        this.process(results);
      });
  }

  process(transactions) {
    const tableData = {
      rows: [],
      headers: []
    };
    const uniqCategories = _.uniqBy(transactions, 'category').filter(el => el.type === 'expense').map(el => el.category).sort();
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

  render() {
    return (
      <div>
        <Table
          height={'700px'}
          fixedHeader={true}
          selectable={true}
          multiSelectable={false}
          style={{fontFamily: "Comic Sans MS"}}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            { this.renderTableHeaders()}
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover={false}
            stripedRows={true}
            >
              { this.renderTableRows() }
          </TableBody>;
        </Table>
      </div>
    );
  }
};

export default Summary;