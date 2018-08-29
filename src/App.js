import './App.css';

import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from './pages/home.js';
import About from './pages/about.js';
import Stocks from './pages/stocks.js';
import Params from './pages/params.js';
import NavigationBar from './components/navigation-bar.js';


class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <NavigationBar/>

                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/home" component={Home} />
                    <Route path="/params/:id" component={Params} />
                    <Route path="/stocks/:id" component={Stocks} />
                </div>
            </Router>
        );
    }
}



export default App;
