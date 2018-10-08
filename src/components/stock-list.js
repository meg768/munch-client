import React from 'react';


import sprintf from 'yow/sprintf';

import {Dropdown, Glyph} from 'react-bootify';
import { Table} from 'react-bootify';
//import { Table} from 'reactstrap';

function debug() {
    console.log.apply(null, arguments);
}


var Module = {};

Module.Glyph = class extends React.Component {


    constructor(args) {
        super(args);

        this.state = {};
        this.onClick = this.onClick.bind(this);

    }

    onClick() {
        this.props.onClick(this.props.stock);
    }

    render() {
        var {icon, onClick, ...other} = this.props;

        return (
            <Table.Row header {...other} onClick={this.onClick} style={{opacity:'1.0'}}>
                <Glyph icon={icon} style={{fontSize:'120%', cursor:'pointer'}} />
            </Table.Row>
        );
    }
}






Module.DropdownMenu = class extends React.Component {

    static defaultProps = {
        icon: 'menu'
    };

    constructor(args) {
        super(args);
        this.state = {};
        this.state.isOpen = false;


        this.toggle = this.toggle.bind(this);
    }

    dismiss() {
        this.setState({isOpen: false});
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }


    render() {
        var id = 'PIM-' + this.props.row;

        var listGroupStyle = {};
        listGroupStyle.cursor = 'pointer';
        listGroupStyle.fontSize = '125%';

        var iconStyle = {};
        iconStyle.fontSize = '120%';
        iconStyle.cursor = 'pointer';

        var items = React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {key:index, stock:this.props.stock, parent:this});
        });



        return (
            <Table.Row>
                <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} placement='left-start'>
                    <Dropdown.Target>
                        <Glyph icon={this.props.icon} style={iconStyle}  onClick={this.toggle} />
                    </Dropdown.Target>
                    <Dropdown.Menu >
                        {items}
                    </Dropdown.Menu>
                </Dropdown>
            </Table.Row>
        );
    }


};


Module.Placeholder = class extends React.Component {



    render() {
        return this.props.children;
    }


};

Module.DropdownDevider = class extends React.Component {



    render() {
        return (
            <div className="dropdown-divider"></div>

        );
    }


};


Module.DropdownItem = class extends React.Component {

    constructor(args) {
        super(args);

        this.onClick = this.onClick.bind(this);

    }

    onClick() {
        this.props.parent.dismiss();

        if (this.props.onClick)
            this.props.onClick(this.props.stock);
    }

    renderIcon() {
        if (this.props.icon) {
            return (
                <Glyph icon={this.props.icon} style={{fontSize:'125%', opacity:'1.0'}}/>
            );
        }
    }

    renderText() {
        if (this.props.text) {
            return this.props.text;
        }
    }

    render() {
        var {onClick, style, ...props} = this.props;

        style = style || {};

        style.cursor = 'pointer';

        return (
            <a className='dropdown-item' onClick={this.onClick} style={style} {...props}>

                {this.renderIcon()}
                {this.renderText()}
                {this.props.children}
            </a>
        );
    }


};




Module.Value = class extends React.Component {

    constructor(args) {
        super(args);

        this.state = {};
        this.onClick = this.onClick.bind(this);

    }

    onClick() {
        this.props.onClick(this.props.stock);
    }

    render() {
        var {onClick, ...other} = this.props;

        return (
            <th {...other} onClick={this.onClick}>
                {this.props.children}
            </th>
        );
    }

}


Module.Table = class extends React.Component {


    constructor(args) {
        super(args);

        this.state = {};

    }

    componentDidMount() {
    }



    renderRow(stock, rowNumber) {

        return React.Children.map(this.props.children, (child, index) => {

            if (child.type === Module.Value) {
                return (
                    <Table.Col key={index}>
                        {stock[child.props.name]}
                    </Table.Col>
                );
            }

            if (child.type === Module.Glyph) {
                return React.cloneElement(child, {key:index, stock:stock});
            }


            if (child.type === Module.DropdownMenu) {
                return React.cloneElement(child, {key:index, row:rowNumber, stock:stock});
            }


            if (child.type === Module.Placeholder) {
                return React.cloneElement(child, {key:index, row:rowNumber, stock:stock});
            }

        });

    }


    renderHeader() {

        var titles = React.Children.map(this.props.children, (child, index) => {
            if (child.type === Module.Value)
                return React.cloneElement(child, {key:index});

            if (child.type === Module.Glyph) {
                return (
                    <Table.Col header key={index}>{' '}</Table.Col>
                );
            }

            if (child.type === Module.DropdownMenu) {
                return (
                    <Table.Col header key={index}>{' '}</Table.Col>
                );
            }

            if (child.type === Module.Placeholder) {
                return (
                    <Table.Col header key={index}>{' '}</Table.Col>
                );
            }

        });

        return (
            <Table.Header>
                <Table.Row>
                    {titles}
                </Table.Row>
            </Table.Header>
        );
    }

    renderBody() {

        var stocks = this.props.stocks.slice();

        var rows = stocks.map((stock, index) => {
            return (
                <Table.Row key={index}>{this.renderRow(stock, index)}</Table.Row>
            );
        });

        return (
            <Table.Body>
                {rows}
            </Table.Body>
        );

    }

    render() {

        if (this.props.stocks.length == 0)
            return (<div/>);


        return(

                <Table hover={true} striped={true}>
                    {this.renderHeader()}
                    {this.renderBody()}
                </Table>
        );

    }
}

export default Module;
