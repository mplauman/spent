import React from 'react';
import PropTypes from 'prop-types';
import {Navbar, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap';

class MenuBar extends React.Component {
  render() {
    const userButton = this.props.loggedIn ? (
      <NavItem eventKey={1} onClick={this.props.logOut} >Sign out</NavItem>
    ) : (
      <NavItem eventKey={1} onClick={this.props.logIn} >Sign in</NavItem>
    );

    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#home'>Spent</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href='#'>Sprints</NavItem>
            <NavItem eventKey={2} href='#'>Expenses</NavItem>
            <NavItem eventKey={3} href='#'>Settings</NavItem>
            <NavDropdown eventKey={4} title='Go' id='basic-nav-dropdown'>
              <MenuItem eventKey={4.1} onClick={this.props.startSprint}>Start a sprint</MenuItem>
              <MenuItem eventKey={4.2} onClick={this.props.addExpense}>Add an expense</MenuItem>
              <MenuItem eventKey={4.3} onClick={this.props.addIncome}>Add some income</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            {userButton}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
MenuBar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  startSprint: PropTypes.func.isRequired,
  addExpense: PropTypes.func.isRequired,
  addIncome: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired
};

export default MenuBar;
