
import React from 'react';
import Router from './components/router.js';

import 'react-bootify/bootswatch/materia/bootstrap.css';
import './App.css';

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
