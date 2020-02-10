import React from "react";
import * as _ from "lodash";

import {
  formatAsCurrency,
  formatPayDate,
  stringToPayDate
} from "../common/Utils";

import Toggle from "material-ui/Toggle";
import TransactionRepo from "../repositories/TransactionRepo";
import SummaryGrid from "./SummaryGrid";

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rawTransactions: [],
      tableHeaders: [],
      tableRows: [],
      categoriesAsCols:
        props.categoriesAsCols === undefined ? true : props.categoriesAsCols
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillMount() {
    const years = this.props.years || [this.props.match.params.year];
    this.fetchAndDisplay(years);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.years, this.props.years) ||
      !_.isEqual(nextProps.transactions, this.props.transactions)
    ) {
      this.fetchAndDisplay(nextProps.years);
    }
    this.displayData(this.state.categoriesAsCols);
  }

  fetchAndDisplay(years) {
    this.setState({ rawTransactions: [] });
    const promises = years.map(year => {
      return TransactionRepo.getAll(year).then(results => {
        const transactions = this.state.rawTransactions.concat(results);
        this.setState({ rawTransactions: transactions });
      });
    });

    Promise.all(promises).then(() =>
      this.displayData(this.state.categoriesAsCols)
    );
  }

  displayData(categoriesAsCols) {
    const uniqCategories = _.uniqBy(this.state.rawTransactions, "category")
      .map(el => el.category)
      .sort();
    const uniqPayDates =
      this.props.paydates ||
      _.reverse(
        _.sortedUniq(
          _.sortBy(this.state.rawTransactions, [
            t => {
              return parseInt(t.payDate.split("-")[1]);
            }
          ]).map(t => t.payDate)
        )
      );

    if (categoriesAsCols) {
      this.convertToCategories(
        this.state.rawTransactions,
        uniqPayDates,
        uniqCategories
      );
    } else {
      this.convertToPayDates(
        this.state.rawTransactions,
        uniqPayDates,
        uniqCategories
      );
    }
  }

  convertToPayDates(transactions, dates, categories) {
    let headers = [];
    let rows = [];

    headers.push("Expenses");
    headers = headers.concat(
      dates.map(date => formatPayDate(stringToPayDate(date), "MMM Do"))
    );
    categories.forEach(category => {
      let row = [];
      row.push(category);
      dates.forEach(payDate => {
        let curTransaction = _.find(transactions, t => {
          return t.category === category && t.payDate === payDate;
        });
        row.push(
          curTransaction ? formatAsCurrency(curTransaction.amount) : "-"
        );
      });

      rows.push(row);
    });

    this.setState({ tableHeaders: headers, tableRows: rows });
  }

  convertToCategories(transactions, dates, categories) {
    let headers = [];
    let rows = [];

    headers.push("Pay Date");
    headers = headers.concat(categories);

    dates.forEach(payDate => {
      let row = [];
      row.push(formatPayDate(stringToPayDate(payDate), "MMM Do"));
      categories.forEach(category => {
        let curTransaction = _.find(transactions, t => {
          return t.category === category && t.payDate === payDate;
        });
        row.push(
          curTransaction ? formatAsCurrency(curTransaction.amount) : "-"
        );
      });

      rows.push(row);
    });

    this.setState({ tableHeaders: headers, tableRows: rows });
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
        {!this.props.hideToggle && (
          <Toggle
            style={{ margin: 0 }}
            labelStyle={{ color: "#B5D9EC" }}
            onToggle={this.handleToggle}
            toggled={this.state.categoriesAsCols}
          />
        )}
        <SummaryGrid
          headers={this.state.tableHeaders}
          rows={this.state.tableRows}
        ></SummaryGrid>
      </div>
    );
  }
}

export default Summary;
