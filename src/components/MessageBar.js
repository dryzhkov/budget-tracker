import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from 'material-ui/Snackbar';

class MessageBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.getStyle = this.getStyle.bind(this);
  }

  handleRequestClose() {
    this.props.requestClose();
  }

  getStyle(type) {
    if (type === 'success') {
      return {
        backgroundColor: '#4CAF50'
      };
    } else if (type === 'error') {
      return {
        backgroundColor: '#f44336'
      };
    }
  }

  render() {
    return (
      <Snackbar
        open={this.props.open}
        message={this.props.message}
        style={this.getStyle(this.props.type)}
        autoHideDuration={4000}
        onRequestClose={this.handleRequestClose}
      />
    );
  } 
};

MessageBar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  type: PropTypes.string
}

export default MessageBar;