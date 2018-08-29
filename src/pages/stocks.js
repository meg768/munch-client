import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';


import { Button, Jumbotron } from 'reactstrap';
import { Alert } from 'reactstrap';

import Request from '../components/request.js';

class Module extends React.Component {


    constructor(args) {
        super(args);

        this.state = {};
        this.state.ready = false;
        this.state.stocks = [];
        this.onClick = this.onClick.bind(this);
    }


    componentDidMount() {
        console.log('FGetching stocks');
        var request = new Request('http://app-o.se:3012');
        var query = {};

        query.sql        = 'select * from stocks where symbol like ?';
        query.values     = 'A%';
        //query.sql = 'select * from stocks';

        request.get('/query', {query:query}).then(response => {
            var stocks = response.body;
            console.log(stocks);
            this.setState({ready:true, stocks:stocks});
        })
        .catch(error => {
            console.log(error);
        })

    }

    onClick() {


    }

    renderList() {
        if (this.state.ready) {
            var children = this.state.stocks.map((stock, index) => {
                return (
                    <ListGroupItem key={index}>{stock.symbol} - {stock.name}</ListGroupItem>
                );
            });

            return (
                <ListGroup>
                    {children}
                </ListGroup>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderList()}
            </div>
        );
    }
}

export default Module;
