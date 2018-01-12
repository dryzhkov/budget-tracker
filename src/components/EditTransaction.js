import React from 'react';
import PropTypes from 'prop-types';

const EditTransaction = (props) => {
  if (props.selectedTransaction) {
    return (
      <div>
        <div className="editfields">
          <div>
            <input
              type="hidden"
              name="id"
              placeholder="id"
              value={props.selectedTransaction.id}
            />
          </div>
          <div>
            <label>Type: </label>
            <label>
              {props.selectedTransaction.type}
            </label>
          </div>
          <div>
            <label>Category: </label>
            <input
              name="category"
              value={props.selectedTransaction.category}
              placeholder="ex: salary"
              onChange={props.onChange}
            />
          </div>
          <div>
            <label>Amount: </label>
            <input
              name="amount"
              value={props.selectedTransaction.amount}
              placeholder="amount"
              onChange={props.onChange}
            />
          </div>
        </div>
        <button onClick={props.onCancel}>Cancel</button>
        <button onClick={props.onSave}>Save</button>
      </div>
    );
  } else {
    return <div></div>;
  }
};

EditTransaction.propTypes = {
  selectedTransaction: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
    category: PropTypes.string,
    amount: PropTypes.number
  })
}

export default EditTransaction;