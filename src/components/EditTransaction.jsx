import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import * as _ from 'lodash';

import TransactionRepo from '../repositories/TransactionRepo';
import {getCurrentPayDate} from '../common/Utils';

class EditTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableCategories: [],
      category: ''
    };

    this.suggestionChange = this.suggestionChange.bind(this);
  }

  componentDidMount() {
    const currentYear = getCurrentPayDate().year;
    TransactionRepo.getUniqueCategories(currentYear)
      .then(categories => {
        this.setState({
          availableCategories: categories
        });
      });
  }

  renderSuggestions() {
    return _.map(this.state.availableCategories, (category, index) => {
      if (!this.props.excludedSuggestions || 
          this.props.excludedSuggestions.indexOf(category._id) < 0) {
        return <MenuItem key={index} value={category._id} primaryText={category._id} />
      }
    });
  }
  
  suggestionChange(event, index, value) {
    this.setState({
      category: value,
    });

    this.props.onChange({
      target: {
        name: 'category',
        value: value
      }
    });
  }

  render() {
    if (this.props.selectedTransaction) {
      return (
        <div>
          <div className="editfields">
            <div className={this.props.addingNew ? '' : 'hidden'}>
              <SelectField
                value={this.state.category}
                onChange={this.suggestionChange}
                floatingLabelText="Select a suggestion"
                floatingLabelStyle={{color: '#B5D9EC'}}
              >
                {this.renderSuggestions()}
              </SelectField>
            </div>
            <div>
              <input
                type="hidden"
                name="id"
                placeholder="id"
                value={this.props.selectedTransaction.id}
              />
            </div>
            <div>
              <label className="edit-label">Type:</label>
              <label>
                {this.props.selectedTransaction.type}
              </label>
            </div>
            <div>
              <label className="edit-label">Category:</label>
              <input
                type="text"
                name="category"
                value={this.props.selectedTransaction.category}
                placeholder="ex: salary"
                onChange={this.props.onChange}
              />
            </div>
            <div>
              <label className="edit-label">Amount:</label>
              <input
                name="amount"
                type="number"
                value={this.props.selectedTransaction.amount}
                placeholder="amount"
                onChange={this.props.onChange}
              />
            </div>
          </div>
          <button onClick={this.props.onCancel}>Cancel</button>
          <button onClick={this.props.onSave}>Save</button>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

EditTransaction.propTypes = {
  selectedTransaction: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
    category: PropTypes.string,
    amount: PropTypes.number
  })
}

export default EditTransaction;