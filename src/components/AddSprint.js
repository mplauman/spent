import React from 'react';
import PropTypes from 'prop-types';
import {InputGroup, Modal, Button, Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';

class DateControl extends React.Component {
  render() {

    return (
      <FormGroup controlId={this.props.controlId}>
        <Col componentClass={ControlLabel} sm={2}>
          {this.props.title}
        </Col>
        <Col sm={10}>
          <FormControl type='date' value={this.props.value} onChange={this.props.onChange} />
        </Col>
      </FormGroup>
    );
  }
}
DateControl.propTypes = {
  controlId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const dateToString = (d) => {
  let year = ('' + d.getFullYear()).padStart(4, '0');
  let month = ('' + (d.getMonth() + 1)).padStart(2, '0');
  let day = ('' + d.getDate()).padStart(2, '0');

  return year + '-' + month + '-' + day;
};

const dateFromString = (d) => {
  let parts = d.split('-');

  return new Date(parts[0], parts[1] - 1, parts[2]);
};

class AddSprint extends React.Component {

  constructor(props) {
    super(props);

    let startDate = new Date();
    let openingBalance = 0.0;
    if (props.currentSprint) {
      startDate = dateFromString(props.currentSprint.endDate);
      startDate.setDate(startDate.getDate() + 1);

      openingBalance = props.currentSprint.revisedClosing;
    }

    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14);

    this.state = {
      startDate: dateToString(startDate),
      endDate: dateToString(endDate),
      openingBalance
    };

    this.handleStartDateChanged = this.handleStartDateChanged.bind(this);
    this.handleEndDateChanged = this.handleEndDateChanged.bind(this);
    this.handleOpeningBalanceChanged = this.handleOpeningBalanceChanged.bind(this);
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
      openingBalance: event.target.value
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
            <DateControl controlId='startDate' title='Start Date' value={this.state.startDate} onChange={this.handleStartDateChanged} />
            <DateControl controlId='endDate' title='End Date' value={this.state.endDate} onChange={this.handleEndDateChanged} />
            <FormGroup controlId='openingBalance'>
              <Col componentClass={ControlLabel} sm={2}>
                Opening Balance
              </Col>
              <Col sm={10}>
                <InputGroup>
                  <InputGroup.Addon>$</InputGroup.Addon>
                  <FormControl type='number' value={this.state.openingBalance} step='0.01'/>
                </InputGroup>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.props.onStart}>Start</Button>
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
