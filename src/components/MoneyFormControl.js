import React from 'react';
import PropTypes from 'prop-types';
import {InputGroup, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';

class MoneyFormControl extends React.Component {
  render() {

    return (
      <FormGroup controlId={this.props.controlId}>
        <Col componentClass={ControlLabel} sm={2}>
          {this.props.title}
        </Col>
        <Col sm={10}>
          <InputGroup>
            <InputGroup.Addon>$</InputGroup.Addon>
            <FormControl type='number' value={this.props.value} step='0.01' onChange={this.props.onChange}/>
          </InputGroup>
        </Col>
      </FormGroup>
    );
  }
}
MoneyFormControl.propTypes = {
  controlId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MoneyFormControl;
