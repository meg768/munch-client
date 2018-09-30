import React from 'react';

import { Table, Popover } from 'reactstrap';

import sprintf from 'yow/sprintf';
import Glyph from './glyph.js';

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
            <td {...other} onClick={this.onClick} style={{opacity:'0.5'}}>
                <Glyph icon={icon} style={{fontSize:'120%', cursor:'pointer'}} />
            </td>
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
        iconStyle.opacity = '0.5';

        var items = React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {key:index, stock:this.props.stock, parent:this});
        });



        return (
            <td>
                <Glyph icon={this.props.icon} id={id} style={iconStyle}  onClick={this.toggle} />
                <Popover hideArrow={true} placement='auto' isOpen={this.state.isOpen} target={id}  toggle={this.toggle}>
                    <div className="dropdown-menu" style={{display:'block'}}>
                        {items}
                    </div>
                </Popover>
            </td>
        );
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

        console.log(this.props);
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
                <Glyph icon={this.props.icon} style={{fontSize:'125%', opacity:'0.5'}}/>
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
                    <td key={index}>
                        {stock[child.props.name]}
                    </td>
                );
            }

            if (child.type === Module.Glyph) {
                return React.cloneElement(child, {key:index, stock:stock});
            }


            if (child.type === Module.DropdownMenu) {
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
                    <th key={index}>{' '}</th>
                );
            }

            if (child.type === Module.DropdownMenu) {
                return (
                    <th key={index}>{' '}</th>
                );
            }

        });

        return (
            <thead>
                <tr>
                    {titles}
                </tr>
            </thead>
        );
    }

    renderBody() {

        var stocks = this.props.stocks.slice();

        var rows = stocks.map((stock, index) => {
            return (
                <tr key={index}>{this.renderRow(stock, index)}</tr>
            );
        });

        return (
            <tbody>
                {rows}
            </tbody>
        );

    }

    render() {

        if (this.props.stocks.length == 0)
            return (<div/>);


        return(

                <Table hover responsive size='sm'>
                    {this.renderHeader()}
                    {this.renderBody()}
                </Table>
        );

    }
}

export default Module;
