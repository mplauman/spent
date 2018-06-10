import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, Form, FormGroup, Col, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

import DateFormControl from './DateFormControl';
import MoneyFormControl from './MoneyFormControl';
import Formatters from '../Formatters';

class AddExpense extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      start: Formatters.dateToString(new Date(Date.now())),
      value: 0.0,
      count: 1,
      frequency: 'once',
      multiadd: false
    };

    this.handleNameChanged = this.handleNameChanged.bind(this);
    this.handleStartChanged = this.handleStartChanged.bind(this);
    this.handleValueChanged = this.handleValueChanged.bind(this);
    this.handleCountChanged = this.handleCountChanged.bind(this);
    this.handleFrequencyChanged = this.handleFrequencyChanged.bind(this);
    this.handleMultiaddChanged = this.handleMultiaddChanged.bind(this);
    this.addExpense = this.addExpense.bind(this);
  }

  handleNameChanged = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  handleStartChanged = (event) => {
    this.setState({
      start: event.target.value
    });
  }

  handleValueChanged = (event) => {
    this.setState({
      value: Number(event.target.value)
    });
  }

  handleCountChanged = (event) => {
    this.setState({
      count: parseInt(event.target.value)
    });
  }

  handleFrequencyChanged = (event) => {
    this.setState({
      frequency: event.target.value
    });
  }

  handleMultiaddChanged = (event) => {
    this.setState({
      multiadd: event.target.checked
    });
  }

  addExpense = () => {
    const prototype = {
      name: this.state.name,
      value: this.state.value * (this.props.isIncome ? 1.0 : -1.0),
      startDate: this.state.start,
      count: this.state.count,
      frequency: this.state.frequency
    };

    this.props.onAdd(prototype, this.state.multiadd);
  }

  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId='expenseName'>
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl type='text' value={this.state.name} onChange={this.handleNameChanged} />
              </Col>
            </FormGroup>
            <DateFormControl controlId='startDate' title='Start Date' value={this.state.start} onChange={this.handleStartChanged} />
            <MoneyFormControl controlId='value' title='Value' value={this.state.value} onChange={this.handleValueChanged} />
            <FormGroup controlId='expenseFrequency'>
              <Col componentClass={ControlLabel} sm={2}>
                Frequecy
              </Col>
              <Col sm={3}>
                <FormControl type='number' disabled={this.state.frequency == 'once'} value={this.state.count} step='1' min='1' onChange={this.handleCountChanged}/>
              </Col>
              <Col sm={7}>
                <FormControl componentClass='select' value={this.state.frequency} onChange={this.handleFrequencyChanged}>
                  <option value='once'>once</option>
                  <option value='days'>day(s)</option>
                  <option value='weeks'>week(s)</option>
                  <option value='months'>month(s)</option>
                  <option value='years'>year(s)</option>
                </FormControl>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Checkbox inline value={this.state.multiadd} onChange={this.handleMultiaddChanged}>Add more</Checkbox>
          &nbsp;
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.addExpense}>Add</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
AddExpense.propTypes = {
  title: PropTypes.string.isRequired,
  isIncome: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AddExpense;
