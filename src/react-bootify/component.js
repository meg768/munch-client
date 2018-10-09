import React from 'react';

export default class Component extends React.Component  {

    constructor(props) {
        super(props);
    }

    debug() {
        console.log.apply(null, arguments);
    }

    render() {
        return (
            <div>
                Basic Component
            </div>            
        );
    }
};
