import './App.css';

import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from './pages/home.js';
import About from './pages/about.js';
import Stocks from './pages/stocks.js';
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
                    <Route path="/stocks" component={Stocks} />
                </div>
            </Router>
        );
    }
}



export default App;
