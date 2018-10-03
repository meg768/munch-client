import React, {Component} from 'react';
import { HashRouter as Router, Route } from "react-router-dom";

import Sample from '../pages/sample.js';
import Home from '../pages/home.js';
import About from '../pages/about.js';
import Stocks from '../pages/stocks.js';
import Stock from '../pages/stock.js';
import Params from '../pages/params.js';
import Statistics from '../pages/statistics.js';
import Charts from '../pages/charts.js';
import NewStock from '../pages/new-stock.js';
import NavigationBar from './navigation-bar.js';

export default class Module extends Component {
    render() {
        return (
            <Router>
                <div>
                    <NavigationBar/>

                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/home" component={Home} />
                    <Route path="/params" component={Params} />
                    <Route path="/stocks" component={Stocks} />
                    <Route path="/stock/:symbol" component={Stock} />
                    <Route path="/statistics" component={Statistics} />
                    <Route path="/charts" component={Charts} />
                    <Route path="/new-stock" component={NewStock} />
                    <Route path="/sample" component={Sample} />
                </div>
            </Router>
        );
    }
}
