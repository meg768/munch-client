import React from 'react';


import logo from '../logo.svg';

/*
<UncontrolledDropdown nav inNavbar>
    <DropdownToggle nav caret>
        Mer
    </DropdownToggle>
    <DropdownMenu right>
        <DropdownItem>
            <NavLink href="#/Charts">Grafer</NavLink>
        </DropdownItem>
        <DropdownItem>
            <NavLink href="#/about">Om Munch</NavLink>
        </DropdownItem>
    </DropdownMenu>
</UncontrolledDropdown>
*/

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
        var style = {};

        style.border = '0.05em solid rgba(0, 0, 0, 0.1)';

        return (
            <div style={style}>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="#/">
                        <img alt="Hej" src={logo}/>
                        Munch
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>


                            <NavItem>
                                <NavLink href='#/stocks/C'>
                                    Tickers
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink href='#/statistics'>
                                    Statistik
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='#/charts?symbol=^OMX'>
                                    OMX
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='#/charts?symbol=AAPL'>
                                    AAPL
                                </NavLink>
                            </NavItem>

                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}




export default NavigationBar;
