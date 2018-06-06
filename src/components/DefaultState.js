import React from 'react';
import PropTypes from 'prop-types';

class DefaultState extends React.Component {
  render() {
    return (
      <div onClick={this.props.onStateClick}>
        This is the default state
      </div>
    );
  }
}
DefaultState.propTypes = {
  onStateClick: PropTypes.func.isRequired
};

export default DefaultState;
