import React from 'react';
import { Form, FormGroup, Input} from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Alert, Button } from 'reactstrap';
import Page from '../components/page.js';
import StockList from '../components/stock-list.js';
import Glyph from '../components/glyph.js';
import Loader from 'react-spinners/PulseLoader';
import sprintf from 'yow/sprintf';
import {isString} from 'yow/is';
import ButtonRow from '../components/button-row.js';
import PersistentComponent from '../components/persistent-component.js';

import Timer from 'yow/timer';


import Request from 'yow/request';


function debug() {
    console.log.apply(null, arguments);
}


export default class Module extends PersistentComponent {



    constructor(args) {

        super(args);

        this.typeTimer = new Timer();

        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onRemoveStock = this.onRemoveStock.bind(this);
        this.onChangeStock = this.onChangeStock.bind(this);
    }

    getPersistentKey() {
        return this.props.location.pathname;
    }

    getDefaultState() {
        var state = {};

        state.version = '1.1';
        state.stocks = null;
        state.hits = 0;
        state.search = '';
        state.message = '';
        state.loading = false;

        return state;
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

            request.get('/query', {query:query}).then(response => {
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
        var state = {};
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

        this.setState({stocks:null, hits:0, message:''});

        this.run(this.search(this.state.search)).then(result => {
            this.setState({hits:result.hits, stocks:result.stocks});
            this.saveState();
        })
        .catch(error => {
            this.setState({message:error.message});
        })


    }


    onKeyPress(event) {
        console.log(event);
        console.log(event.target.charCode);
        console.log(event.key);

        if (event.key == 'Enter') {
            this.onSearch();
        }
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
            this.setState({message:error.message});
        })
    }

    onChangeStock(stock) {
        this.props.history.push('/stock/' + stock.symbol);
    }


    renderList() {


        if (this.state.stocks) {
            if (this.state.stocks.length == 0) {
                return (
                    <Alert color="light">
                        <strong>
                        {'Hittade ingenting.'}
                        </strong>
                    </Alert>
                );

            };


            return (
                <StockList.Table stocks={this.state.stocks}>
                    <StockList.Value name='symbol'>Symbol</StockList.Value>
                    <StockList.Value name='name'>Namn</StockList.Value>
                    <StockList.Value name='industry'>Industri</StockList.Value>
                    <StockList.Value name='sector'>Sektor</StockList.Value>
                    <StockList.Value name='exchange'>Börs</StockList.Value>
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


    renderMessage() {

        if (!this.state.loading && isString(this.state.message) && this.state.message.length > 0) {
            return (
                <Alert color="info">
                    {this.state.message}
                </Alert>
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
                        <Loader loading={true} color={'lightblue'}/>
                    </div>
            );

        }
    }
    renderButtons() {
        if (!this.state.loading) {
            return(
                <ButtonRow style={{textAlign:'right'}}>
                    <Button color='primary' href='#/new-stock'>
                        <Glyph icon='plus-circled'>
                        </Glyph>
                        Lägg till symboler
                    </Button>

                </ButtonRow>

            );

        }

    }

    render() {
        var columnStyle = {marginTop:'0.5em', marginBottom:'0.5em'};
        return (
            <Page>
                <Container>
                <Form>
                    <Row>
                        <Col xs={9} sm={10} md={10} lg={11}>
                            <FormGroup>
                                    <Input id='search' type="text" disabled={this.state.loading} value={this.state.search} placeholder="Sök efter aktie" onKeyPress={this.onKeyPress} onChange={this.onChange}/>
                            </FormGroup>
                        </Col>
                        <Col xs={3} sm={2} md={2} lg={1}>
                            <FormGroup style={{textAlign:'right'}}>
                                <Button disabled={this.state.loading || this.state.search.length == 0} color='primary' onClick={this.onSearch}>
                                    <Glyph icon='search-solid'>
                                    </Glyph>
                                </Button>
                            </FormGroup>
                        </Col>

                    </Row>
                </Form>
                <div>
                    {this.renderHitCount()}
                    {this.renderList()}
                    {this.renderButtons()}
                    {this.renderMessage()}
                    {this.renderLoader()}
                </div>
                </Container>
            </Page>
        );
    }
}
