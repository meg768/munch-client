import './App.css';

import React from 'react';
import Router from './components/router.js';
import Theme from 'react-bootify-theme';

export default class App extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Theme supplier='bootswatch' name='cerulean'>
                <Router/>
            </Theme>
        );
    }
}
