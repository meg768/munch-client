import React from 'react';
import { Button } from 'reactstrap';
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { DropdownMenu, DropdownItem } from 'reactstrap';

import {Table} from 'reactstrap';
import {isArray, isFunction} from 'yow/is';
import sprintf from 'yow/sprintf';
import Icon from './icon.js';
import Glyph from './glyph.js';

function debug() {
    console.log.apply(null, arguments);
}

function onClick(icon, symbol) {
    alert(sprintf('icon %s - symbol - %s', icon, symbol));

}


class PopupIconMenuItem extends React.Component {

    constructor(args) {
        super(args);
    }


        render() {
            var {icon, style, ...props} = this.props;

            return (
                <i className={'icon-'+icon} {...props} style={style} />
            );

        }

    render() {
        var {style, onClick, ...props} = this.props;

        style = style || {};

        style.paddingTop = '0.5em';
        style.paddingBottom = '0.5em';

        console.log(onClick);

        return (
            <ListGroupItem action onClick={onClick} style={style} {...props}>
                {this.props.children}
            </ListGroupItem>
        );
    }


};


class PopupIconMenu extends React.Component {

    static defaultProps = {
        icon: 'menu'
    };

    constructor(args) {
        super(args);
        this.state = {};
        this.state.isOpen = false;

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }


    render() {
        var id = 'PIM-' + this.props.id;

        var spanStyle = {};
        var iconStyle = {};
        var popoverStyle = {};
        var listGroupStyle = {};

        iconStyle.opacity = '0.5';
        listGroupStyle.cursor = 'pointer';
        listGroupStyle.fontSize = '125%';



        return (
            <span style={spanStyle}>
                <Glyph icon={this.props.icon} id={id} onClick={this.toggle} style={iconStyle}/>
                <Popover hideArrow={true} placement='bottom' isOpen={this.state.isOpen} target={id} toggle={this.toggle} style={popoverStyle}>
                    <ListGroup flush={false} style={listGroupStyle}>
                        {this.props.children}
                    </ListGroup>
                </Popover>
            </span>
        );
    }


};


export default class Module extends React.Component {


    constructor(args) {
        super(args);

        this.state = {};

    }


    onClick(icon, symbol) {
        alert(sprintf('icon %s - symbol - %s', icon, symbol));

    }

    renderHeader() {
        var titles = this.props.columns.map((column, index) => {
            return column.title;
        });

        if (this.props.icons.length > 0)
            titles.push('');


        var th = titles.map((title, index) => {
            return (
                <th key={index}>{title}</th>
            );
        });

        return (
            <thead>
                <tr>
                    {th}
                </tr>
            </thead>
        );
    }


    renderRow(stock, rowNumber) {
        var columns = this.props.columns.map((column, index) => {
            return column.name;
        });


        var th = columns.map((column, index) => {
            return (
                <td key={index}>
                    {stock[column]}
                </td>
            );
        });

        if (this.props.popupMenu) {
            var menuItems = this.props.popupMenu.map((menuItem, index) => {
                return (
                    <PopupIconMenuItem key={index}>
                        <span onClick={menuItem.onClick.bind(this, stock)}>
                            {menuItem.text}
                        </span>
                    </PopupIconMenuItem>

                );
            });

            if (menuItems.length > 0) {
                th.push(
                    <td key={9999}>
                        <PopupIconMenu id={rowNumber}>
                            {menuItems}
                        </PopupIconMenu>
                    </td>
                );

            };

        }


        return th;
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


Module.defaultProps = {
    columns: [
        {name: 'symbol',  title: 'Symbol'},
        {name: 'name',  title: 'Namn'},
        {name: 'industry',  title: 'Industri'},
        {name: 'sector',  title: 'Sektor'},
        {name: 'exchange',  title: 'Börs'},
        {name: 'type',  title: 'Typ'}
    ],
    menu: [
        {icon:'cancel-circled'},
        {icon:'ok-circled'},
        {icon:'menu'},
    ],
    icons: [
        {icon:'cancel-circled'},
        {icon:'ok-circled'},
        {icon:'menu'},
    ]
};
