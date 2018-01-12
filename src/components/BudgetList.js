import React, { Component } from 'react';

import Transaction from './Transaction';
import EditTransaction from './EditTransaction';
import PayDatePicker from './PayDatePicker';
import MessageBar from './MessageBar';
import * as Utils from '../common/Utils';
import TransactionRepo from '../repositories/TransactionRepo';

class BudgetList extends Component {
  constructor() {
    super();

    this.state = {
      transactions: [], 
      addingNew: false,
      budget: {
        totalIncome: 0,
        totalExpense: 0,
        totalSaving: 0
      },
      selectedPayDate: Utils.getCurrentPayDate() 
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEnableAddMode = this.handleEnableAddMode.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.closeMessageBar = this.closeMessageBar.bind(this);
  }

  componentDidMount() {
    this.fetchTransactions(this.state.selectedPayDate);
  }

  fetchTransactions(payDate) {
    TransactionRepo.get(payDate)
      .then(result => {
        this.setState({ transactions: result, budget: Utils.calculateBudget(result)});
      });
  }

  handleSelect(transaction) {
    this.setState({
      selectedTransaction: transaction
    });
  }

  handleCancel() {
    this.setState({ addingNew: false, selectedTransaction: null });
  }

  handleOnChange(event) {
    let selectedTransaction = this.state.selectedTransaction;
    selectedTransaction[event.target.name] = event.target.value;
    this.setState({ selectedTransaction: selectedTransaction });
  }

  handleEnableAddMode(type) {
    this.setState({
      addingNew: true,
      selectedTransaction: { id: 0, type: type, amount: 0 }
    });
  }

  handleSave() {
    let transactions = this.state.transactions;
    if (this.state.addingNew) {
      const transaction = Object.assign({
        payDate: this.state.selectedPayDate
      }, this.state.selectedTransaction);

      TransactionRepo
        .create(transaction)
        .then(result => {
          transactions.push(result);

          let budget = Utils.calculateBudget(transactions);
          this.setState({
            transactions: transactions,
            selectedTransaction: null,
            addingNew: false,
            budget: budget
          });

          this.displayMessage('Transaction has been saved!', 'success');
        })
        .catch(err => {
          this.displayMessage('Unable to save.', 'error');
          console.log(err);
        });
    } else {
      TransactionRepo
        .update(this.state.selectedTransaction)
        .then(() => {
          let budget = Utils.calculateBudget(this.state.transactions);
          this.setState({ selectedTransaction: null, budget });
          this.displayMessage('Updated!', 'success');
        })
        .catch(err => {
          this.displayMessage('Unable to update.', 'error');
          console.log(err);
        });
    }
  }

  handleDelete(event, transaction) {
    event.stopPropagation();
    
    TransactionRepo
      .destroy(transaction)
      .then(() => {
        let transactions = this.state.transactions;

        transactions = transactions.filter(t => t.id !== transaction.id);

        let budget = Utils.calculateBudget(transactions);
        this.setState({
          transactions,
          budget
        });

        if (this.state.selectedTransaction.id === transaction.id) {
          this.setState({selectedTransaction: null});
        }
      })
      .catch((error) => console.log(error));
  }

  renderTransactionsByType(type) {
    return this.state.transactions.map(transaction => {
      if (transaction.type === type) {
        return <Transaction 
                key={transaction.id} 
                transaction={transaction} 
                onSelect={this.handleSelect}
                onDelete={this.handleDelete}
                selectedTransaction={this.state.selectedTransaction} />;
      }
    });
  }

  handleDateChange(value) {
    if (value !== this.state.selectedPayDate) {
      this.setState({
        selectedPayDate: value
      });

      this.fetchTransactions(value);
    }
  }

  closeMessageBar() {
    this.setState({
      showMessageBar: false,
      messageText: null
    })
  }

  displayMessage(msg, type) {
    this.setState({
      showMessageBar: true,
      messageText: msg,
      messageType: type
    });
  }


  render() {
    return (
      <div className="budgetwrapper">
        <PayDatePicker onChange={this.handleDateChange} />
        <div className="transaction-groups">
          <h2 className="totalheader">Income</h2>
          <div className="total income-text">{Utils.formatAsCurrency(this.state.budget.totalIncome)}</div>
          <ul className="transactions">
            {
              this.renderTransactionsByType('income')
            }
          </ul>
        </div>
        <div className="transaction-groups">
          <h2 className="totalheader">Expense</h2>
          <div className="total expense-text">{Utils.formatAsCurrency(this.state.budget.totalExpense)}</div>
          <ul className="transactions">
            {
              this.renderTransactionsByType('expense')
            }
          </ul>
        </div>
        <div className="transaction-groups">
          <h2 className="totalheader">Saving</h2>
          <div className="total saving-text">{Utils.formatAsCurrency(this.state.budget.totalSaving)}</div>
          <ul className="transactions">
            {
              this.renderTransactionsByType('saving')
            }
          </ul>
        </div>
        <div className="transaction-groups balance-area">
          <h2 className="totalheader">Balance</h2>
          <div className="total balance-text">{Utils.formatAsCurrency(this.state.budget.totalIncome - this.state.budget.totalExpense - this.state.budget.totalSaving)}</div>
        </div>

        <div className="editarea">
          <button onClick={() => this.handleEnableAddMode('income')}>+ Income</button>
          <button onClick={() => this.handleEnableAddMode('expense')}>+ Expense</button>
          <button onClick={() => this.handleEnableAddMode('saving')}>+ Saving</button>
          <EditTransaction 
            addingNew={this.state.addingNew} 
            selectedTransaction={this.state.selectedTransaction} 
            onChange={this.handleOnChange}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
          />
        </div>
        
        <MessageBar 
          open={this.state.showMessageBar}
          message={this.state.messageText}
          type={this.state.messageType}
          requestClose={this.closeMessageBar}
          />
      </div>
    );
  }
}

export default BudgetList;