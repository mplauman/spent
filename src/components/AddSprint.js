import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Form} from 'react-bootstrap';

import DateFormControl from './DateFormControl';
import MoneyFormControl from './MoneyFormControl';
import Formatters from '../Formatters';

class AddSprint extends React.Component {

  constructor(props) {
    super(props);

    let startDate = new Date();
    let openingBalance = 0.0;
    if (props.currentSprint) {
      startDate = Formatters.dateFromString(props.currentSprint.endDate);
      startDate.setDate(startDate.getDate() + 1);

      openingBalance = props.currentSprint.revisedClosing;
    }

    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 13);

    this.state = {
      startDate: Formatters.dateToString(startDate),
      endDate: Formatters.dateToString(endDate),
      openingBalance
    };

    this.handleStartDateChanged = this.handleStartDateChanged.bind(this);
    this.handleEndDateChanged = this.handleEndDateChanged.bind(this);
    this.handleOpeningBalanceChanged = this.handleOpeningBalanceChanged.bind(this);
    this.startSprint = this.startSprint.bind(this);
  }

  handleStartDateChanged(event) {
    this.setState({
      startDate: event.target.value
    });
  }

  handleEndDateChanged(event) {
    this.setState({
      endDate: event.target.value
    });
  }

  handleOpeningBalanceChanged(event) {
    this.setState({
      openingBalance: Number(event.target.value)
    });
  }

  startSprint() {
    this.props.onStart({
      openingBalance: this.state.openingBalance,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    });
  }

  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Start a Sprint</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form horizontal>
            <DateFormControl controlId='startDate' title='Start Date' value={this.state.startDate} onChange={this.handleStartDateChanged} />
            <DateFormControl controlId='endDate' title='End Date' value={this.state.endDate} onChange={this.handleEndDateChanged} />
            <MoneyFormControl controlId='openingBalance' title='Opening Balance' value={this.state.openingBalance} onChange={this.handleOpeningBalanceChanged} />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.startSprint}>Start</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
AddSprint.propTypes = {
  onStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  currentSprint: PropTypes.object
};

export default AddSprint;
