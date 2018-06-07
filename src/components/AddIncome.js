import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

class AddIncome extends React.Component {
  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>New Income</Modal.Title>
        </Modal.Header>

        <Modal.Body>Input parameters for the new income.</Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.props.onCancel}>Start</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
AddIncome.propTypes = {
  onStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AddIncome;
