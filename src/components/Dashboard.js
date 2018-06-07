import React from 'react';
import PropTypes from 'prop-types';

const Dashboard = (props) => {
  if (!props.loggedIn) {
    return (<div>introduction text</div>);
  }

  return (
    <div>
      this is the dashboard
    </div>
  );
};
Dashboard.propTypes = {
  loggedIn: PropTypes.bool.isRequired
};

export default Dashboard;
