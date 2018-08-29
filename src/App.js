import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Button } from 'reactstrap';
import { Alert } from 'reactstrap';
import Home from './pages/home.js';
import About from './pages/about.js';
import Stocks from './pages/stocks.js';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

class Example extends React.Component {
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
                                <NavLink href="/stocks">Tickers</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/home">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/about">About</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Options
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <NavLink href="/about">About</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/home">Home</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>Option 2</DropdownItem>
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
};

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Example/>

                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/home" component={Home} />
                    <Route path="/stocks" component={Stocks} />
                </div>
            </Router>
        );
    }
}



export default App;
