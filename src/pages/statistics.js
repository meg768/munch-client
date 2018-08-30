
import React from 'react';


import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';

import Page from '../components/page.js';
import Request from '../components/request.js';


export default class Module extends React.Component {

    constructor(args) {

        super(args);

        this.state = {};
        this.state.ready = false;
        this.state.stats = {};
    }


    componentDidMount() {
        console.log('Fetching statistics');
        var request = new Request('http://app-o.se:3012');
        var query = {};

        query.sql = "";
        query.sql += "SELECT 'Antal aktier' AS name,  (select count(*) from stocks) as number";
        query.sql += " union "
        query.sql += "select 'Senast uppdaterad', (select CAST(DATE_FORMAT(date, '%Y-%m-%d') AS char) from quotes order by date desc limit 1)";
        query.sql += " union "
        query.sql += "select 'Första uppdatering', (select CAST(DATE_FORMAT(date, '%Y-%m-%d') AS char) from quotes order by date asc limit 1)";

        request.get('/query', {query:query}).then(response => {
            console.log(response.body);
            this.setState({ready:true, stats:response.body});
        })
        .catch(error => {
            console.log(error);
        })

    }

    renderList() {
        if (this.state.ready) {
            var children = this.state.stats.map((stat, index) => {
                return (
                    <ListGroupItem key={index}>{stat.name} - {stat.number}</ListGroupItem>
                );
            });

            return (
                <ListGroup>
                    <ListGroupItem disabled><ListGroupItemHeading>Statistik</ListGroupItemHeading></ListGroupItem>
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
