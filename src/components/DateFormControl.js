import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';

class DateFormControl extends React.Component {
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
DateFormControl.propTypes = {
  controlId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default DateFormControl;
