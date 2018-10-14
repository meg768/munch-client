import React from 'react';


import sprintf from 'yow/sprintf';

import {Table, Dropdown, Glyph} from 'react-bootify';

function debug() {
    console.log.apply(null, arguments);
}


var Module = {};





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


Module.Dropdown = class extends React.Component {


    render() {
        return (
            <span>
                Dropdown
            </span>
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

           return (
               <Table.Col key={index} >
                    {child.props.render ? child.props.render(stock) : '-'}
                </Table.Col>

           );

        });

    }


    renderHeader() {

        var titles = React.Children.map(this.props.children, (child, index) => {

            return (
                <Table.Col header key={index}>
                    {child.props.children}
                </Table.Col>
            );


        });

        return (
            <Table.Header >
                <Table.Row>
                    {titles}
                </Table.Row>
            </Table.Header>
        );
    }

    renderBody() {

        var stocks = this.props.stocks.slice();

        var rows = this.props.stocks.map((stock, index) => {
            return (
                <Table.Row  key={index}>{this.renderRow(stock, index)}</Table.Row>
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
