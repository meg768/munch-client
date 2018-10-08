import './App.css';

import React from 'react';
import Router from './components/router.js';
import Theme from './components/theme.js';


export default class App extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Theme name='darkly'>
                <Router/>
            </Theme>
        );
    }
}
