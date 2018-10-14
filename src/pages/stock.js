import React from 'react';


import {Container, Row, Col, Form, Alert, Button, Glyph} from 'react-bootify';
import Page from '../components/page.js';
import Spinner from '../components/spinner.js';

import Request from 'yow/request';
import {Storage} from '../components/storage.js';


function debug() {
    console.log.apply(null, arguments);
}



export default class Module extends React.Component {


    constructor(props) {

        super(props);


        this.storage = new Storage(this.props.location.pathname);
        this.state = this.loadState();

        this.onStockChange = this.onStockChange.bind(this);
        this.onOK = this.onOK.bind(this);
        this.onCancel = this.onCancel.bind(this);

        console.log(this.state);

    }


    saveState() {
        this.storage.save({});
        //return this.props.location.pathname;
    }

    loadState() {
        return this.storage.load({
            stock: null,
            loading: false,
            alert: null
        });
    }

    onOK(event) {
        this.props.history.goBack();

    }

    onCancel() {
    }

    onStockChange(event) {
        var stock = this.state.stock;
        stock[event.target.id] = event.target.value;
        this.setState({stock:stock});
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

    componentDidMount() {
        this.setState({loading:true});

        var query = {};
        query.sql = 'SELECT * FROM stocks where ?? = ?';
        query.values = ['symbol', this.props.match.params.symbol];

        this.mysql(query).then(stocks => {
            if (stocks.length == 0)
                throw new Error('Hmm...');

            this.setState({stock:stocks[0], loading:false});
        })
        .catch(error => {
            this.setState({loading:false, alert:{color:'light', message:error.message}});
        })

    }

    renderAlert() {

        if (this.state.alert) {
            var style = {};
            style.fontSize = '150%';
            style.textAlign = 'center';

            return (
                <Alert color={this.state.alert.color} style={style}>
                    {this.state.alert.message}
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
                    <Spinner/>
                </div>
            );

        }
    }

    renderButtons() {
        if (!this.state.loading && !this.state.alert) {
            return(
                <div style={{textAlign:'right'}}>
                    <Button color='primary' onClick={this.onOK}>
                        Spara
                    </Button>
                </div>

            );

        }

    }


    renderForm() {

        if (this.state.stock) {

            return (
                <Form>
                    <Form.Group>
                        <Form.Label>Symbol</Form.Label>
                        <Form.Input type="text" readOnly plainText id="symbol" value={this.state.stock.symbol}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Namn</Form.Label>
                        <Form.Input id='name' type="text" disabled={this.state.loading} value={this.state.stock.name} placeholder="Namn" onChange={this.onStockChange}/>
                    </Form.Group>

                    <Form.Row>
                        <Form.Group md={6}>
                            <Form.Label>Industri</Form.Label>
                            <Form.Input id='industry' type="text" disabled={this.state.loading} value={this.state.stock.industry} placeholder="Industri" onChange={this.onStockChange}/>
                        </Form.Group>
                        <Form.Group md={6}>
                            <Form.Label>Sektor</Form.Label>
                            <Form.Input id='sector' type="text" disabled={this.state.loading} value={this.state.stock.sector} placeholder="Sektor" onChange={this.onStockChange}/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group md={6}>
                            <Form.Label>Börs</Form.Label>
                            <Form.Input id='exchange' type="text" disabled={this.state.loading} value={this.state.stock.exchange} placeholder="Industri" onChange={this.onStockChange}/>
                        </Form.Group>
                        <Form.Group md={6}>
                            <Form.Label>Typ</Form.Label>
                            <Form.Input id='type' type="text" disabled={this.state.loading} value={this.state.stock.type} placeholder="Industri" onChange={this.onStockChange}/>
                        </Form.Group>
                    </Form.Row>
                </Form>

            );
        }

    }


    render() {
        return (
            <Page>
                <Container>
                    <div>
                        {this.renderForm()}
                        {this.renderLoader()}
                        {this.renderButtons()}
                        {this.renderAlert()}
                    </div>
                </Container>
            </Page>
        );
    }
}
