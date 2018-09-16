import './App.css';

import React from 'react';
import Router from './components/router.js';


export default class App extends React.Component {
    render() {
        return (
            <Router/>
        );
    }
}


/*
class App extends React.Component {
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
                    <Route path="/stocks/:id" component={Stocks} />
                    <Route path="/statistics" component={Statistics} />
                    <Route path="/charts" component={Charts} />
                    <Route path="/new-stock" component={NewStock} />
                </div>
            </Router>
        );
    }
}



export default App;
*/
