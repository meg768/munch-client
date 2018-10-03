import React from 'react';

import StockList from '../components/stock-list.js';
import {Spinner, Container, Row, Col, Form, Alert, Input, Button, ButtonRow, Glyph, Page} from '../components/ui.js';

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
                <ButtonRow style={{textAlign:'right'}}>
                    <Button color='primary' onClick={this.onOK}>
                        Spara
                    </Button>
                </ButtonRow>

            );

        }

    }

    renderForm() {

        if (this.state.stock) {

            return (
                <div>
                <Form>
                    <Form.Group>
                        <Form.Label style={{fontSize:'200%'}}>
                            {this.state.stock.symbol}

                        </Form.Label>
                    </Form.Group>

                    <Form.Group row>
                        <Form.Label for="name">Namn</Form.Label>
                        <Form.Input id='name' type="text" disabled={this.state.loading} value={this.state.stock.name} placeholder="Namn" onChange={this.onStockChange}/>
                    </Form.Group>
                    <Form.Group row>
                        <Form.Label for="industry">Industri</Form.Label>
                        <Form.Input id='industry' type="text" disabled={this.state.loading} value={this.state.stock.industry} placeholder="Industri" onChange={this.onStockChange}/>
                    </Form.Group>
                    <Form.Group row>
                        <Form.Label for="sector">Sektor</Form.Label>
                        <Form.Input id='sector' type="text" disabled={this.state.loading} value={this.state.stock.sector} placeholder="Sektor" onChange={this.onStockChange}/>
                    </Form.Group>
                    <Form.Group row>
                        <Form.Label for="exchange">Börs</Form.Label>
                        <Form.Input id='exchange' type="text" disabled={this.state.loading} value={this.state.stock.exchange} placeholder="Industri" onChange={this.onStockChange}/>
                    </Form.Group>
                    <Form.Group row>
                        <Form.Label for="type">Typ</Form.Label>
                        <Form.Input id='type' type="text" disabled={this.state.loading} value={this.state.stock.type} placeholder="Industri" onChange={this.onStockChange}/>
                    </Form.Group>
                </Form>

                <Form>
                  <Form.Group>
                    <Form.Label for="exampleInputEmail1">Email address</Form.Label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                    <small id="emailHelp" class="form-text text-muted">Well never share your email with anyone else.</small>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label for="exampleInputPassword1">Password</Form.Label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                  </Form.Group>
                  <Form.Group className="form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                    <Form.Label class="form-check-label" for="exampleCheck1">Check me out</Form.Label>
                  </Form.Group>
                  <button type="submit" class="btn btn-primary">Submit</button>
                </Form>
                </div>

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
