import React from 'react';
import Page from '../components/page.js';
import Request from 'yow/request';
import sprintf from 'yow/sprintf';
import yahoo from 'yahoo-finance';

import {isFunction} from 'yow/is';
import {isArray, isString} from 'yow/is';

import { Badge, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import Loader from 'react-spinners/PulseLoader';

import Icon from '../components/icon.js';
import Glyph from '../components/glyph.js';

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
        if (isFunction(this.props.onSaveStocks))
            this.props.onSaveStocks();
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

    renderLoader() {

        if (this.state.loading) {
            var style = {};

            style.textAlign = 'center';
            style.textAlign = 'center';
            style.display = 'flex';
            style.justifyContent = 'center';

            return (
                    <div style={style}>
                        <Loader loading={true} color={'lightblue'}/>
                    </div>
            );

        }
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
                    <Button color='primary' disabled={this.props.stocks.length == 0} onClick={this.onSave}>Spara</Button>
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
        this.state.loading = false;


        this.state.loading = false;
        this.onChange = this.onChange.bind(this);
        this.onOK = this.onOK.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onRemoveStock = this.onRemoveStock.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSaveStocks = this.onSaveStocks.bind(this);


    }


    onChange(event) {
        var state = {};
        state[event.target.id] = event.target.value.toUpperCase();
        this.setState(state);
    }

    onKeyPress(event) {
    }


    run(promise) {

        return new Promise((resolve, reject) => {
            var time = new Date();

            this.setState({loading:true});

            promise.then((result) => {
                var now = new Date();
                var delay =  Math.max(1000, Math.abs(time.valueOf() - now.valueOf()));

                setTimeout(() => {
                    this.setState({loading:false});
                    resolve(result);
                }, delay);

            })
            .catch(error => {
                reject(error);
            })

        });

    }

    saveStock(stock) {
        return new Promise((resolve, reject) => {
            var request = new Request('http://app-o.se:3012', {debug:debug});
            var query = {};

            var names = [];
    		var values = [];

    		Object.keys(stock).forEach(function(name) {
    			names.push(name);
    			values.push(stock[name]);
    		});

            var query = {};
            query.sql        = '';
            query.values     = [];

            query.sql += 'INSERT INTO stocks ';

            query.sql += '(' + names.map((name, index) => {
                query.values.push(name);
                return '??';
            }).join(',') + ') ';

            query.sql += ('VALUES ');

            query.sql += '(' + values.map((value, index) => {
                query.values.push(value);
                return '?';
            }).join(',') + ') ';

            query.sql += 'ON DUPLICATE KEY UPDATE ';

            query.sql += names.map((name) => {
                query.values.push(name);
                query.values.push(name);

    			return '?? = VALUES(??)';
    		}).join(',') + ' ';



            request.get('/query', {query:query}).then(response => {
                resolve();
            })
            .catch(error => {
                console.log(error);
                reject(error);
            })

        });
    }


    saveStocks(stocks) {
        return new Promise((resolve, reject) => {

            var promise = Promise.resolve();

            stocks.forEach((stock, index) => {
                promise = promise.then(() => {
                    return this.saveStock(stock).then(stock => {
                    });
                });
            });

            promise.then(() => {
                resolve();
            });

            promise.catch(error => {
                reject(error)
            });

        });

    }


    getStock(symbol) {
        return new Promise(function(resolve, reject) {

            var request = new Request('http://app-o.se:3012');

            var query = {};
            query.symbol = symbol;

            request.get('/lookup', {query:query}).then(response => {
                resolve(response.body || null);
            })
            .catch(error => {
                resolve(null);
            });

        });
    }

    getStocks(symbols) {
        return new Promise((resolve, reject) => {

            if (isString(symbols)) {
                symbols = symbols.replace('\t', ' ');
                symbols = symbols.replace('\n', ' ');
                symbols = symbols.replace('\r', ' ');
                symbols = symbols.replace(',', ' ');
                symbols = symbols.replace(';', ' ');

                symbols = symbols.split(' ');
            }

            var promise = Promise.resolve();
            var stocks = [];

            symbols.forEach((symbol, index) => {
                promise = promise.then(() => {
                    return this.getStock(symbol).then(stock => {
                        if (stock && isString(stock.name) && stock.name.length > 0)
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

        this.setState({stocks:newStocks, symbol:''});
    }


    onOK(event) {

        this.run(this.getStocks(this.state.symbol)).then((stocks) => {

            this.addStocks(stocks);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    onCancel(event) {
        alert('Cancel');
    }

    onSaveStocks() {

        this.run(this.saveStocks(this.state.stocks)).then(() => {
            this.setState({stocks:[]});
        })
        .catch((error) => {
            console.error(error);
        });

    }

    onRemoveStock(symbol) {

        var stocks = this.state.stocks.filter((stock) => {
            return stock.symbol != symbol;
        });

        this.setState({stocks:stocks});
    }

    renderList() {

        if (this.state.stocks) {
            return (
                <StockList onRemoveStock={this.onRemoveStock} onSaveStocks={this.onSaveStocks} stocks={this.state.stocks}/>

            );
        }
    }

    renderLoader() {

        if (this.state.loading) {
            var style = {};

            style.textAlign = 'center';
            style.textAlign = 'center';
            style.display = 'flex';
            style.justifyContent = 'center';

            return (
                    <div style={style}>
                        <Loader loading={true} color={'lightblue'}/>
                    </div>
            );

        }
    }

    render() {
        var columnStyle = {marginTop:'0.5em', marginBottom:'0.5em'};

        return (
            <Page>
                <Container>
                    <Form>
                        <FormGroup>
                            <Input id='symbol' type="text" value={this.state.symbol} placeholder="Sök efter symboler" onKeyPress={this.onKeyPress} onChange={this.onChange}/>
                        </FormGroup>
                        <FormGroup>
                            <ButtonRow style={{textAlign:'right'}}>
                                <Button disabled={this.state.symbol.length == 0 || this.state.loading} color='primary' onClick={this.onOK} >
                                    <Glyph icon='search-solid'>
                                    </Glyph>
                                    Sök
                                </Button>
                            </ButtonRow>
                        </FormGroup>
                    </Form>

                    <br/>



                    {this.renderList()}
                    {this.renderLoader()}
                </Container>
            </Page>
        );
    }
}
