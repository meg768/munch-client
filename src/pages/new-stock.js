import React from 'react';
import Page from '../components/page.js';
import Request from 'yow/request';
import sprintf from 'yow/sprintf';
import yahoo from 'yahoo-finance';

import {isFunction} from 'yow/is';
import {isArray, isString} from 'yow/is';

import { Badge, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import Loader from 'react-spinners/PulseLoader';

import Icon from '../components/icon.js';
import Glyph from '../components/glyph.js';

import ButtonRow from '../components/button-row.js';
import StockList from '../components/stock-list.js';





function debug() {
    console.log.apply(null, arguments);
}



export default class Example extends React.Component {

    constructor(args) {
        super(args);

        this.state = {};
        this.state.symbol = '';
        this.state.stocks = [];
        this.state.loading = false;
        this.state.alert = null;


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
        state.alert = null;
        state[event.target.id] = event.target.value.toUpperCase();
        this.setState(state);
    }

    onKeyPress(event) {
    }


    run(promise) {

        return new Promise((resolve, reject) => {
            var time = new Date();

            this.setState({alert:null, loading:true});

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

            if (stocks.length == 0)
                this.setState({alert:{color:'primary', message:sprintf('Hittade inga symboler som matchade "%s"', this.state.symbol)}});

            this.addStocks(stocks);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    onCancel(event) {
    }

    onSaveStocks() {

        this.run(this.saveStocks(this.state.stocks)).then(() => {
            this.setState({stocks:[]});
        })
        .catch((error) => {
            console.error(error);
        });

    }

    onRemoveStock(stock) {

        var stocks = this.state.stocks.filter((item) => {
            return stock.symbol != item.symbol;
        });

        this.setState({stocks:stocks});
    }

    renderList() {

        if (this.state.stocks && this.state.stocks.length > 0) {

            return (
                <div>
                    <StockList.Table stocks={this.state.stocks}>
                        <StockList.Value name='symbol'>Symbol</StockList.Value>
                        <StockList.Value name='name'>Namn</StockList.Value>
                        <StockList.Value name='industry'>Industri</StockList.Value>
                        <StockList.Value name='sector'>Sektor</StockList.Value>
                        <StockList.Value name='exchange'>Börs</StockList.Value>
                        <StockList.Value name='type'>Typ</StockList.Value>
                        <StockList.Glyph icon='cancel-circled' style={{textAlign:'right'}} onClick={this.onRemoveStock}/>
                    </StockList.Table>
                    <ButtonRow style={{textAlign:'right'}}>
                        <Button color='primary' disabled={this.state.stocks.length == 0} onClick={this.onSaveStocks}>Spara</Button>
                    </ButtonRow>
                </div>
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

    renderAlert() {

        if (this.state.alert) {
            var style = {};

            style.marginTop = '1em';
            style.marginBottom = '1em';
            style.fontSize = '125%';
            style.opacity = '0.8';

            return (
                    <div style={style}>
                        <Alert color={this.state.alert.color}>
                            {this.state.alert.message}
                        </Alert>
                    </div>
            );

        }
    }

    render() {

        return (
            <Page>
                <Container>
                    <Form>
                        <Row>
                            <Col xs={9} sm={10} md={10} lg={11}>
                                <FormGroup >
                                    <Input  id="symbol" type="text" value={this.state.symbol} placeholder="AAPL, TSLA, T, KO" onKeyPress={this.onKeyPress} onChange={this.onChange}/>
                                </FormGroup>
                            </Col>
                            <Col xs={3} sm={2} md={2} lg={1}>
                                <FormGroup style={{textAlign:'right'}}>
                                    <Button disabled={this.state.symbol.length == 0 || this.state.loading} color='primary' onClick={this.onOK} >
                                        <Glyph icon='search-solid'/>
                                    </Button>
                                </FormGroup>
                            </Col>

                        </Row>
                    </Form>

                    <div>
                        {this.renderList()}
                        {this.renderAlert()}
                        {this.renderLoader()}
                    </div>
                </Container>
            </Page>
        );
    }
}
