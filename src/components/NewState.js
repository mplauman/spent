import React from 'react';
import PropTypes from 'prop-types';

class NewState extends React.Component {
  render() {
    return (
      <div onClick={this.props.onStateClick}>
        This is the new state
      </div>
    );
  }
}
NewState.propTypes = {
  onStateClick: PropTypes.func.isRequired
};

export default NewState;
