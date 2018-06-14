import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button} from 'react-bootstrap';

import SocialButton from './SocialButton';

class LogInDialog extends React.Component {

  googleLoginSuccess = (resp) => {
    this.props.onSuccess({
      provider: 'google',
      token: resp._token.idToken,
      displayName: resp._profile.firstName,
      userId: resp._profile.id
    });
  }
  googleLoginFailure = (resp) => {
    console.info('google login failure', resp);
    this.props.onCancel();
  }

  linkedinLoginSuccess = (resp) => {
    this.props.onSuccess({
      provider: 'linkedin',
      token: resp._token.accessToken,
      displayName: resp._profile.firstName,
      userId: resp._profile.id
    });
  }
  linkedinLoginFailure = (resp) => {
    console.info('linkedin login failure', resp);
    this.props.onCancel();
  }

  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Start a Sprint</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <SocialButton
            provider='google'
            appId={this.props.googleAppId}
            onLoginSuccess={this.googleLoginSuccess}
            onLoginFailure={this.googleLoginFailure}>
            Google
          </SocialButton>
          &nbsp;
          <SocialButton
            provider='linkedin'
            appId={this.props.linkedinAppId}
            onLoginSuccess={this.linkedinLoginSuccess}
            onLoginFailure={this.linkedinLoginFailure}>
            LinkedIn
          </SocialButton>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onCancel}>Cancel</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
LogInDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  googleAppId: PropTypes.string.isRequired,
  linkedinAppId: PropTypes.string.isRequired
};

export default LogInDialog;
