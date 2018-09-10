import React from 'react';
import Page from '../components/page.js';
import Request from 'yow/request';
import sprintf from 'yow/sprintf';
import yahoo from 'yahoo-finance';

import {isFunction} from 'yow/is';
import {isArray} from 'yow/is';

import { Badge, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import Icon from '../components/icon.js';

import ButtonRow from '../components/button-row.js';
//import ButtonRow from '../components/button-row.js';





function debug() {
    console.log.apply(null, arguments);
}



class StockList extends React.Component {


    constructor(args) {
        super(args);

        this.state = {};

        this.onSave = this.onSave.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }

    onRowClick(symbol) {
        if (isFunction(this.props.onRemoveStock))
            this.props.onRemoveStock(symbol);

    }
    onSave() {
        alert('Snart. Rom byggdes inte på en dag.');
    }

    renderHeader() {
        var titles = ['Symbol', 'Name', 'Industry', 'Sector', 'Exchange', ''];

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

    renderRow(stock) {
        var columns = ['symbol', 'name', 'industry', 'sector', 'exchange'];

        var th = columns.map((column, index) => {
            return (
                <td key={index}>{stock[column]}</td>
            );
        });


        th.push(
            <td key={9999}>
                <Icon icon='cancel-circled' size='120%' style={{cursor:'pointer', opacity:'0.5'}} onClick={this.onRowClick.bind(this, stock.symbol)}/>
            </td>
        );


        return th;
    }


    renderBody() {

        var stocks = this.props.stocks.slice();

        var rows = stocks.map((stock, index) => {
            return (
                <tr key={index}>{this.renderRow(stock)}</tr>
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
            <div>
                <Table responsive size='sm'>
                    {this.renderHeader()}
                    {this.renderBody()}
                </Table>
                <ButtonRow style={{textAlign:'right'}}>
                    <Button color='primary' disabled={this.props.stocks.length == 0} onClick={this.onSave}>Spara i Munch</Button>
                </ButtonRow>
            </div>
        );

    }
}
export default class Example extends React.Component {

    constructor(args) {
        super(args);

        this.state = {};
        this.state.symbol = '';
        this.state.stocks = [];

        /*

        this.state.stocks.push({
            symbol:'AAPL',
            name: 'Apple Inc.',
            industry: 'Food Market',
            sector: 'Candy',
            exchange: 'Aktietorget'
        });
*/
        this.state.busy = false;
        this.onChange = this.onChange.bind(this);
        this.onOK = this.onOK.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onRemoveStock = this.onRemoveStock.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onTest = this.onTest.bind(this);


    }


    onPaste() {
        alert('Detta tolkar texten i urklipp och lägger upp alla hittade symboler/tickers i listan.');
    }
    onChange(event) {
        var state = {};
        state[event.target.id] = event.target.value.toUpperCase();
        this.setState(state);
    }

    onKeyPress(event) {
        console.log(event);
        console.log(event.target.charCode);
        console.log(event.key);

        if (event.key == 'Enter') {
            this.onOK();
        }
    }

    onTest() {
        this.getStocks(['AAPL', 'TSLA', 'T']).then((stocks) => {
            this.addStocks(stocks);
        });
    }


    xxxxx() {
        return new Promise((resolve, reject) => {
            var request = new Request('http://app-o.se:3012', {debug:debug});
            var query = {};

            var sql = '';
            sql += sprintf('INSERT INTO stocks (`symbol`, `name`) VALUES (?, ?) ');
    		sql += sprintf('ON DUPLICATE KEY UPDATE `symbol` = ?, `name` = ?');

            query.sql        = sql;
            query.values     = ['KALLE', 'PELLE', 'KALLE', 'PELLE'];

            request.get('/query', {query:query}).then(response => {
                resolve();
            })
            .catch(error => {
                console.log(error);
                reject(error);
            })

        });
    }

    getStock(symbol) {
        return new Promise(function(resolve, reject) {

            var request = new Request('http://app-o.se:3012');

            var query = {};
            query.symbol = symbol;

            request.get('/lookup', {query:query}).then(response => {
                resolve(response.body || {});
            })
            .catch(error => {
                reject(error);
            });

        });
    }

    getStocks(symbols) {
        return new Promise((resolve, reject) => {

            var promise = Promise.resolve();
            var stocks = [];

            symbols.forEach((symbol, index) => {
                promise = promise.then(() => {
                    return this.getStock(symbol).then(stock => {
                        stocks.push(stock);
                    });
                });
            });

            promise.then(() => {
                resolve(stocks);
            });

            promise.catch(error => {
                reject(error)
            });

        });

    }



    addStocks(stocks) {
        var symbols = {};
        var newStocks = [];

        this.setState({busy:true});

        this.state.stocks.forEach((stock, index) => {
            symbols[stock.symbol] = stock;
        });

        stocks.forEach((stock, index) => {
            symbols[stock.symbol] = stock;
        });

        for (var key in symbols) {
            newStocks.push(symbols[key]);
        }

        newStocks.sort((a, b) => {
             return a.symbol.localeCompare(b.symbol);
        });

        this.setState({stocks:newStocks, symbol:'', busy:false});
    }

    onOK(event) {
        this.getStock(this.state.symbol).then((stock) => {

            this.addStocks([stock]);
        })
        .catch((error) => {
            console.error(error);
            alert('Kunde inte hittas...');
        });
    }

    onCancel(event) {
        alert('Cancel');
    }

    onRemoveStock(symbol) {

        console.log('onRemoveStock', symbol);

        var stocks = this.state.stocks.filter((stock) => {
            return stock.symbol != symbol;
        });

        this.setState({stocks:stocks});
    }


    render() {

        return (
            <Page>
                <Container>
                    <Row>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Label>Ange symbol</Label>
                                    <Input id='symbol' type="text" value={this.state.symbol} placeholder="HM-B.ST" onKeyPress={this.onKeyPress} onChange={this.onChange}/>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <ButtonRow style={{textAlign:'right'}}>
                    <Button  color='primary' onClick={this.onTest}>Prova lägg till TSLA, AAPL och T</Button>
                        <Button disabled={false} color='primary' onClick={this.onPaste}>Lägg till från urklipp</Button>
                        <Button disabled={this.state.symbol.length == 0 || this.state.busy} color='primary' onClick={this.onOK}>Lägg till</Button>
                    </ButtonRow>
                    <br/>
                    <StockList onRemoveStock={this.onRemoveStock} stocks={this.state.stocks}/>
                </Container>
            </Page>
        );
    }
}
