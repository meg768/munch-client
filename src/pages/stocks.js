import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Alert, Button, ButtonGroup } from 'reactstrap';
import Page from '../components/page.js';
import StockList from '../components/stock-list.js';
import Glyph from '../components/glyph.js';
import Loader from 'react-spinners/PulseLoader';


import Request from 'yow/request';


function debug() {
    console.log.apply(null, arguments);
}


export default class Module extends React.Component {


    constructor(args) {

        super(args);


        this.state = {};
        this.state.stocks = null;
        this.state.search = '';
        this.message = '';
        this.state.loading = false;

        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onRemoveStock = this.onRemoveStock.bind(this);
        this.onChangeStock = this.onChangeStock.bind(this);
    }


    mysql(query) {

        return new Promise((resolve, reject) => {
            console.log('Fetching stocks');
            var time = new Date();
            var request = new Request('http://app-o.se:3012', {debug:debug});

            request.get('/query', {query:query}).then(response => {
                return response.body;
            })
            .then((result) => {
                var now = new Date();
                var delay =  Math.max(1000, Math.abs(time.valueOf() - now.valueOf()));

                setTimeout(() => {
                    resolve(result);
                }, delay);

            })
            .catch(error => {
                reject(error);
            })

        });

    }

    search(name) {
        var query = {};

        query.sql        = 'SELECT * FROM stocks WHERE symbol LIKE ? OR name LIKE ? LIMIT 100';
        query.values     = [];
        query.values.push('%' + name + '%');
        query.values.push('%' + name + '%');

        return this.mysql(query);
    }


    onChange(event) {
        var state = {};
        state[event.target.id] = event.target.value.toUpperCase();
        console.log(state);
        this.setState(state);
    }

    componentDidMount() {
        this.setState({loading:true, stocks:null, message:null});

        this.search('AAPL').then(stocks => {
            this.setState({stocks:stocks, loading:false});
        })
        .catch(error => {
            this.setState({loading:false});
        })

    }

    onSearch() {
        this.setState({loading:true, stocks:null, message:null});

        this.search(this.state.search).then(stocks => {
            this.setState({stocks:stocks, loading:false});
        })
        .catch(error => {
            this.setState({message:error.message, loading:false});
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
        var query = {};
        query.sql = 'DELETE FROM stocks WHERE symbol = ?';
        query.values = [stock.symbol];

        console.log(query);

        this.setState({stocks:null, loading:true});

        this.mysql(query).then(result => {
            this.setState({message:'OK', loading:false});
        })
        .catch(error => {
            this.setState({message:error.message, loading:false});
        })
    }

    onChangeStock(stock) {
        alert(stock.symbol);
    }

    renderList() {

        var popupMenu = [
            {text: 'Ta bort', onClick:this.onRemoveStock},
            {text: 'Ändra', onClick:this.onChangeStock}
        ];

        if (this.state.stocks) {
            if (this.state.stocks.length == 0) {
                return (
                    <Alert color="light">
                        {'Nope!'}
                    </Alert>
                );

            };
            return <StockList stocks={this.state.stocks} popupMenu={popupMenu}/>
        }


    }

    renderMessage() {

        if (this.state.message) {
            return (
                <Alert color="info">
                    {this.state.message}
                </Alert>
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
        var columnStyle = {marginTop:'0.5em', marginBottom:'0.5em', textAlign:'center'};
        return (
            <Page>
                <Container>
                    <Form>
                        <FormGroup row>
                            <Col xs="12" sm="9" md="10" lg="11" style={columnStyle}>
                                <Input id='search' type="text" disabled={this.state.loading} value={this.state.search} placeholder="Sök" onKeyPress={this.onKeyPress} onChange={this.onChange}/>
                            </Col>
                            <Col xs="12" sm="3" md="2" lg="1" style={columnStyle}>
                                <Button disabled={this.state.loading} color='primary' onClick={this.onSearch} style={{textAlign:'center', width:'100%'}}>
                                    <Glyph icon='search-solid'>
                                    </Glyph>
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    <div>
                        {this.renderList()}
                        {this.renderLoader()}
                        {this.renderMessage()}
                    </div>
                </Container>
            </Page>
        );
    }
}
