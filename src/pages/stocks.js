import React from 'react';
import StockList from '../components/stock-list-2.js';
import sprintf from 'yow/sprintf';
import {isString} from 'yow/is';

import Timer from 'yow/timer';
import {Storage} from '../components/storage.js';
import {Tag, Alert, Form, Container, Button, Dropdown} from 'react-bootify';
import Page from '../components/page.js';
import Spinner from '../components/spinner.js';
import Glyph from '../components/glyph.js';

import Request from 'yow/request';


function debug() {
    console.log.apply(null, arguments);
}

export default class Module extends React.Component {



    constructor(args) {

        super(args);

        this.typeTimer = new Timer();
        this.storage = new Storage(this.props.location.pathname);
        this.state = this.loadState();

        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onRemoveStock = this.onRemoveStock.bind(this);
        this.onChangeStock = this.onChangeStock.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    loadState() {
        return this.storage.load({
            stocks: null,
            hits: 0,
            search: '',
            alert: null,
            dropdownOpen: false,
            currentSymbol: '',
            loading: false
        });

    }

    saveState() {
        this.storage.save({stocks:this.state.stocks});
    }

    componentWillUnmount() {
        this.saveState();
    }

    toggleDropdown() {
        this.setState({dropdownOpen:!this.state.dropdownOpen});
    }



    run(promise) {

        return new Promise((resolve, reject) => {
            var time = new Date();

            this.setState({loading:true});

            promise.then((result) => {
                var now = new Date();
                var delay =  Math.max(750, Math.abs(time.valueOf() - now.valueOf()));

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



    search(name) {
        return new Promise((resolve, reject) => {

            var search = {};
            search.hits = 0;
            search.stocks = [];

            Promise.resolve().then(() => {
                var query = {};
                query.sql = 'SELECT COUNT(symbol) AS hits FROM stocks WHERE symbol LIKE ? OR name LIKE ?';
                query.values = [];
                query.values.push('%' + name + '%');
                query.values.push('%' + name + '%');

                return this.mysql(query);

            })

            .then(results => {
                search.hits = results[0].hits;

                var query = {};
                query.sql        = 'SELECT * FROM stocks WHERE symbol LIKE ? OR name LIKE ? LIMIT 100';
                query.values     = [];
                query.values.push('%' + name + '%');
                query.values.push('%' + name + '%');

                return this.mysql(query);

            })
            .then(results => {
                search.stocks = results;
                return Promise.resolve();
            })
            .then(() => {
                resolve(search);
            })
            .catch(error => {
                reject(error);
            });

        });
    }



    mysql(query) {

        return new Promise((resolve, reject) => {
            var request = new Request('http://app-o.se:3012', {debug:debug});

            request.get('/mysql', {query:query}).then(response => {
                return response.body;
            })
            .then((result) => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            })

        });

    }

    onChange(event) {
        var state = {alert:null};
        state[event.target.id] = event.target.value.toUpperCase();
        this.setState(state);
    }

    componentDidMount() {

        if (this.state.stocks == null) {
            this.run(this.search('AAPL')).then(result => {
                this.setState({hits:result.hits, stocks:result.stocks});
            })
            .catch(error => {
            })

        }
    }


    onSearch() {

        this.setState({stocks:[], hits:0, alert:null});

        this.run(this.search(this.state.search.trim())).then(result => {

            if (result.hits == 0)
                this.setState({alert:{color:'primary', message:'Hittade ingenting'}});
            else
                this.setState({hits:result.hits, stocks:result.stocks});

            this.saveState();
        })
        .catch(error => {
            this.setState({alert: {color:'primary', message:error.message}});
        })


    }


    onKeyPress(event) {
    }

    onRemoveStock(stock) {
        console.log('onRemoveStock', arguments);
        return;

        var query = {};
        query.sql = 'DELETE FROM stocks WHERE symbol = ?';
        query.values = [stock.symbol];

        console.log(query);

        this.setState({stocks:null});

        this.run(this.mysql(query)).then(result => {
            this.setState({message:'OK'});
        })
        .catch(error => {
            this.setState({alert: {color:'primary', message:error.message}});
        })
    }

    onChangeStock(stock) {
        this.props.history.push('/stock/' + stock.symbol);
    }



    renderList() {

        var menuIcon = require('../glyphs/bars-solid.svg');

        if (this.state.stocks && this.state.stocks.length > 0) {


            var renderDropdown = (stock) => {

                return (
                    <Dropdown placement='left-start'>
                        <Dropdown.Target>
                            <div>
                                <Glyph svg={menuIcon}/>
                            </div>
                        </Dropdown.Target>
                        <Dropdown.Menu>
                            <Dropdown.Item >Visa graf</Dropdown.Item>
                            <Dropdown.Item onClick={this.onChangeStock.bind(this, stock)} >Redigera</Dropdown.Item>
                            <Dropdown.Separator/>
                            <Dropdown.Item >Radera</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )
            };
            return (
                <StockList.Table stocks={this.state.stocks}>
                    <StockList.Value render={(stock) => {return stock.symbol}}>Symbol</StockList.Value>
                    <StockList.Value render={(stock) => {return stock.name}}>Namn</StockList.Value>
                    <StockList.Value render={(stock) => {return stock.industry}}>Industri</StockList.Value>
                    <StockList.Value render={(stock) => {return stock.exchange}}>Börs</StockList.Value>
                    <StockList.Value render={(stock) => {return stock.country}}>Land</StockList.Value>
                    <StockList.Value render={(stock) => {return stock.type}}>Typ</StockList.Value>
                    <StockList.Value render={renderDropdown}>
                        <Glyph svg={menuIcon}/>
                    </StockList.Value>

                </StockList.Table>
            );

            return (
                <StockList.Table stocks={this.state.stocks} onStockClick={this.onStockClick}>
                    <StockList.Value name='symbol'>Symbol</StockList.Value>
                    <StockList.Value name='name'>Namn</StockList.Value>
                    <StockList.Value name='industry'>Industri</StockList.Value>
                    <StockList.Value name='exchange'>Börs</StockList.Value>
                    <StockList.Value name='country'>Land</StockList.Value>
                    <StockList.Value name='type'>Typ</StockList.Value>
                    <StockList.DropdownMenu>
                        <StockList.DropdownItem icon='chart-line'>Visa graf</StockList.DropdownItem>
                        <StockList.DropdownItem icon='grin-squint-tears-regular' onClick={this.onChangeStock}>Redigera</StockList.DropdownItem>
                        <StockList.DropdownDevider/>
                        <StockList.DropdownItem icon='cancel' onClick={this.onRemoveStock}>Radera</StockList.DropdownItem>
                    </StockList.DropdownMenu>
                </StockList.Table>
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

    renderHitCount() {
        if (this.state.stocks && this.state.hits > this.state.stocks.length) {
            return (

                <div>
                    <strong>
                        {sprintf('Visar %s av %d symboler', this.state.stocks.length, this.state.hits)}
                    </strong>
                    <br/>
                    <br/>
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
                        <Spinner/>
                    </div>
            );

        }
    }
    renderButtons() {
        var icon = require('../glyphs/times-circle-solid.svg');

        if (!this.state.loading) {
            return(
                <div style={{textAlign:'right'}}>
                    <Button color='primary' href='#/new-stock'>
                        <Glyph svg={icon}>
                        </Glyph>
                        Lägg till symboler
                    </Button>

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
                    <Form.Row>
                        <Form.Group xs={10} sm={10} md={10} lg={11}>
                            <Form.Input id='search' type="text" disabled={this.state.loading} value={this.state.search} placeholder="Sök efter aktie" onKeyPress={this.onKeyPress} onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group xs={2} sm={2} md={2} lg={1} style={{textAlign:'right'}}>
                            <Button disabled={this.state.loading || this.state.search.length == 0} color='primary' onClick={this.onSearch}>
                                <Glyph svg={require('../glyphs/search-solid.svg')}>
                                </Glyph>
                            </Button>
                        </Form.Group>

                    </Form.Row>
                </Form>
                <div>
                    {this.renderHitCount()}
                    {this.renderList()}
                    {this.renderButtons()}
                    {this.renderAlert()}
                    {this.renderLoader()}
                </div>
                </Container>
                </Page>
        );
    }
}
