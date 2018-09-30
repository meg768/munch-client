import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Alert, Button, ButtonGroup } from 'reactstrap';
import Page from '../components/page.js';
import StockList from '../components/stock-list.js';
import Glyph from '../components/glyph.js';
import Loader from 'react-spinners/PulseLoader';
import PersistentComponent from '../components/persistent-component.js';
import ButtonRow from '../components/button-row.js';

import Request from 'yow/request';


function debug() {
    console.log.apply(null, arguments);
}


export default class Module extends React.Component {


    constructor(props) {

        super(props);


        this.state = this.getDefaultState();

        this.onStockChange = this.onStockChange.bind(this);
        this.onOK = this.onOK.bind(this);
        this.onCancel = this.onCancel.bind(this);

        console.log(this.state);

    }

    getPersistentKey() {
        return this.props.location.pathname;
    }

    getDefaultState() {
        var state = {};

        state.stock = null;
        state.loading = false;
        state.alert = null;

        return state;
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
            this.setState({loading:false, alert:{color:'info', message:error.message}});
        })

    }

    renderAlert() {

        if (this.state.alert) {
            return (
                <Alert color={this.state.alert.color}>
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
                    <Loader loading={true} color={'lightblue'}/>
                </div>
            );

        }
    }

    renderButtons() {
        if (!this.state.loading) {
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
                <Form>
                    <FormGroup row>
                        <Label style={{fontSize:'200%'}}>
                            {this.state.stock.symbol}

                        </Label>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="name">Namn</Label>
                        <Input id='name' type="text" disabled={this.state.loading} value={this.state.stock.name} placeholder="Namn" onChange={this.onStockChange}/>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="industry">Industri</Label>
                        <Input id='industry' type="text" disabled={this.state.loading} value={this.state.stock.industry} placeholder="Industri" onChange={this.onStockChange}/>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="sector">Sektor</Label>
                        <Input id='sector' type="text" disabled={this.state.loading} value={this.state.stock.sector} placeholder="Sektor" onChange={this.onStockChange}/>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exchange">Börs</Label>
                        <Input id='exchange' type="text" disabled={this.state.loading} value={this.state.stock.exchange} placeholder="Industri" onChange={this.onStockChange}/>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="type">Typ</Label>
                        <Input id='type' type="text" disabled={this.state.loading} value={this.state.stock.type} placeholder="Industri" onChange={this.onStockChange}/>
                    </FormGroup>
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
