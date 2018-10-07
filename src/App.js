import './App.css';
import 'bootswatch/dist/materia/bootstrap.min.css';

import React from 'react';
import Router from './components/router.js';


export default class App extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router/>
        );
    }
}
