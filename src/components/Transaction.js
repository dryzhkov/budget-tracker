import React from 'react';
import * as Utils from '../common/Utils';
import PropTypes from 'prop-types';

const Transaction = (props) => {
  return (
    <li 
      onClick={() => props.onSelect(props.transaction)}
      className={props.transaction === props.selectedTransaction ? 'selected' : ''}
    >
      <div className="transaction-element">
        <div className="category">
          {props.transaction.category}
          <button className="delete-button" onClick={(e) => props.onDelete(e, props.transaction)}>Delete</button>
        </div>
        <div className="amount">{Utils.formatAsCurrency(props.transaction.amount)}</div>
      </div>
    </li>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.shape({
    selectedTransaction: PropTypes.object,
    category: PropTypes.string,
    amount: PropTypes.number
  })
}

export default Transaction;