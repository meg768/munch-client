import React from 'react';
import {Alert} from 'react-bootify';


import ReactDOM from 'react-dom';


function debug() {
    console.log.apply(null, arguments);
}


export default class Module extends React.Component {


    constructor(args) {

        super(args);

    }


    render() {

        return (
            <Alert dismissable>
                <Alert.Heading>
                    Heading
                </Alert.Heading>
                HEJ
            </Alert>
        );

    }
}
