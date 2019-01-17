import React from 'react';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

const NavBar = () =>
    <Navbar inverse collapseOnSelect>
        <Navbar.Header>
            <Navbar.Brand><a href="/">Trip Poll</a></Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem eventKey={1} href="/propose">Propose a Trip</NavItem>
                <NavItem eventKey={2} href="/view">View a Trip</NavItem>
                <NavDropdown eventKey={3} title="Other" id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1} href="/trips">All Trips</MenuItem>
                    <MenuItem eventKey={3.2} href="/places">Interesting Places</MenuItem>
                    <MenuItem eventKey={3.3} href="/updates">Trip Updates</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.3} href="/info">Information</MenuItem>
                </NavDropdown>
            </Nav>
            <Nav pullRight>
                <NavItem eventKey={1} href="/contact">Contact</NavItem>
                <NavItem eventKey={2} href="/login">Login</NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>

export default NavBar;