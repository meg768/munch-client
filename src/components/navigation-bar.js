import React, { Component } from 'react';


import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";




import {
    Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Munch</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>

                            <NavItem>
                                <NavLink href='#/stocks'>
                                    Tickers
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink href='#/home'>
                                    Home
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='#/about'>
                                    About
                                </NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Options
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <NavLink href="#/about">About</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="#/home">Home</NavLink>
                                    </DropdownItem>
                                    <DropdownItem divider />

                                    <DropdownItem>Reset</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}




export default NavigationBar;
