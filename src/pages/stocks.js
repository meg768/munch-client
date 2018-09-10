import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import Page from '../components/page.js';



import Request from 'yow/request';


function debug() {
    console.log.apply(null, arguments);
}
class Module extends React.Component {


    constructor(args) {

        super(args);

        console.log('args', args.match.params);
        this.params = args.match.params;
        this.state = {};
        this.state.ready = false;
        this.state.stocks = [];
        this.onClick = this.onClick.bind(this);
    }


    componentDidMount() {
        console.log('Fetching stocks');
        var request = new Request('http://app-o.se:3012', {debug:debug});
        var query = {};

        query.sql        = 'select * from stocks where symbol like ?';
        query.values     = 'A%';


        request.get('/query', {query:query}).then(response => {
            var stocks = response.body;
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
                    <ListGroupItem disabled><ListGroupItemHeading>Tickers</ListGroupItemHeading></ListGroupItem>

                    {children}
                </ListGroup>
            );
        }
    }

    render() {
        return (
            <Page>
                {this.renderList()}
            </Page>
        );
    }
}

export default Module;
