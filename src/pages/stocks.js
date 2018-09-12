import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { Form, FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import Page from '../components/page.js';
import StockList from '../components/stock-list.js';
import Glyph from '../components/glyph.js';


import Request from 'yow/request';


function debug() {
    console.log.apply(null, arguments);
}


export default class Module extends React.Component {


    constructor(args) {

        super(args);


        this.state = {};
        this.state.stocks = null;
        this.state.error = null;
        this.state.search = '';

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    search(name) {
        return new Promise((resolve, reject) => {
            console.log('Fetching stocks');
            var request = new Request('http://app-o.se:3012', {debug:debug});
            var query = {};

            query.sql        = 'SELECT * FROM stocks WHERE symbol LIKE ? OR name LIKE ?';
            query.values     = [];
            query.values.push('%' + name + '%');
            query.values.push('%' + name + '%');


            request.get('/query', {query:query}).then(response => {
                resolve(response.body);
            })
            .catch(error => {
                reject(error);
            })

        });

    }

    onChange(event) {
        var state = {};
        state[event.target.id] = event.target.value.toUpperCase();
        console.log(state);
        this.setState(state);
    }

    componentDidMount() {
        this.search('AAPL').then(stocks => {
            this.setState({stocks:stocks});
        })
        .catch(error => {
            this.setState({error:error});
        })

    }

    onClick() {
        this.search(this.state.search).then(stocks => {
            this.setState({stocks:stocks});
        })
        .catch(error => {
            this.setState({error:error});
        })


    }

    renderList() {
        if (this.state.stocks) {
            return <StockList stocks={this.state.stocks}/>
        }
    }

    render() {
        return (
            <Page>
                <Container>
                    <Form>
                        <FormGroup row>
                            <Col xs={11}>
                                <Input id='search' type="text" value={this.state.search} placeholder="Sök" onChange={this.onChange}/>
                            </Col>
                            <Col xs={1}>
                                <Button color='primary' onClick={this.onClick}>
                                    <Glyph icon='search-solid'>
                                    </Glyph>
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    <div>
                        {this.renderList()}
                    </div>
                </Container>
            </Page>
        );
    }
}
