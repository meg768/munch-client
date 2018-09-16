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

        var stock = {};
        stock.symbol = this.props.match.params.symbol;
        stock.name = '';
        stock.sector = '';
        stock.industry = '';
        stock.exchange = '';

        this.state = {};
        this.state.stock = stock;
        this.state.message = null;
        this.state.loading = false;

        this.onStockChange = this.onStockChange.bind(this);

        console.log(this.state);

    }

    onStockChange(event) {
        var stock = this.state.stock;
        stock[event.target.id] = event.target.value;
        console.log('Äääääää', stock);
        this.setState({stock:stock});
    }

    mysql(query) {

        return new Promise((resolve, reject) => {
            console.log('Fetching stocks');
            var time = new Date();
            var request = new Request('http://app-o.se:3012', {debug:debug});

            request.get('/stock', {query:query}).then(response => {
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


    componentDidMount() {
        this.setState({loading:true, stock:this.state.stock, message:null});

        this.mysql({symbol:this.state.stock.symbol}).then(stock => {
            this.setState({stock:stock, loading:false});
        })
        .catch(error => {
            this.setState({loading:false, message:error.message});
        })

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

    renderForm() {


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
                    <Label for="sector">Namn</Label>
                    <Input id='sector' type="text" disabled={this.state.loading} value={this.state.stock.sector} placeholder="Sektor" onChange={this.onStockChange}/>
                </FormGroup>
                <FormGroup row>
                    <Label for="industry">Namn</Label>
                    <Input id='industry' type="text" disabled={this.state.loading} value={this.state.stock.industry} placeholder="Industri" onChange={this.onStockChange}/>
                </FormGroup>
            </Form>

        );
    }


    render() {
        return (
            <Page>
                <Container>
                    <div>
                        {this.renderForm()}
                        {this.renderLoader()}
                        {this.renderMessage()}
                    </div>
                </Container>
            </Page>
        );
    }
}
