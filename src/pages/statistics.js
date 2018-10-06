
import React from 'react';


import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import Page from '../components/page.js';
import {Container, Row, Col} from 'react-bootify';
import Request from 'yow/request';
import Spinner from '../components/spinner.js';


export default class Module extends React.Component {

    constructor(args) {

        super(args);

        this.state = {};
        this.state.stats = null;
        this.state.error = null;
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

        this.run(request.get('/mysql', {query:query})).then(response => {
            this.setState({stats:response.body});
        })
        .catch(error => {
            console.log(error);
            this.setState({error:error});
        })

    }

    renderSpinner() {
        if (!this.state.stats) {
            return (
                <Spinner/>
            );

        }
        else {
            return null;
        }
    }

    renderList() {
        if (this.state.stats) {
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
        else {
            return null;
        }
    }

    render() {
        return (
            <Page>
                <Container>
                    {this.renderSpinner()}
                    {this.renderList()}
                </Container>
            </Page>

        );
    }

}
