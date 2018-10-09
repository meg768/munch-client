import React from 'react';


import logo from '../logo.svg';
import {Icon} from '../react-bootify';

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
/*
import {
    Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
*/
class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        console.log('toggle');
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        var style = {};

        style.border = '0.05em solid rgba(0, 0, 0, 0.1)';

        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
              <a className="navbar-brand" href="#">
                  <Icon style={{transform:'scale(3.0)', color:'green', marginRight:'0.75em', marginLeft:'0.5em'}} icon='chart-line'></Icon>
                  Munch


              </a>


              <div className="collapse navbar-collapse" style={{textAlign:'right'}} id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="#/stocks">Aktier <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="nav-item active">
                    <a className="nav-link" href="#/statistics">Statistik</a>
                  </li>
                </ul>
              </div>
            </nav>
        );
/*
        return (
            <div style={style}>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="#/">
                        <Icon style={{transform:'scale(3.0)', color:'green', marginRight:'0.75em', marginLeft:'0.5em'}} icon='chart-line'></Icon>
                        Munch
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href='#/stocks'>
                                    Aktier
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='#/statistics'>
                                    Statistik
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
        */
    }
}




export default NavigationBar;
