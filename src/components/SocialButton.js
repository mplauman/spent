import React from 'react';
import PropTypes from 'prop-types';
import SocialLogin from 'react-social-login';

const Button = ({ children, triggerLogin, ...props }) => (
  <button onClick={triggerLogin} {...props}>
    { children }
  </button>
);

Button.propTypes = {
  children: PropTypes.string.isRequired,
  triggerLogin: PropTypes.func.isRequired
};

export default SocialLogin(Button);
