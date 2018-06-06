import React from 'react';
import PropTypes from 'prop-types';
import {Navbar, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap';

class MenuBar extends React.Component {
  render() {
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
              <MenuItem eventKey={4.1}>Start a sprint</MenuItem>
              <MenuItem eventKey={4.2}>Add an expense</MenuItem>
              <MenuItem eventKey={4.3}>Add some income</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href='#'>Sign in</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
MenuBar.propTypes = {
  startSprint: PropTypes.func.isRequired,
  addExpense: PropTypes.func.isRequired,
  addIncome: PropTypes.func.isRequired,
};

export default MenuBar;
