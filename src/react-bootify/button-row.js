import React from 'react';
import Component from './component.js';

export default class ButtonRow extends Component  {

    constructor(args) {
        super(args);

        this.state = {};

    }

    render() {

        var children = React.Children.map(this.props.children, (child, index) => {
            var style = Object.assign({}, {display:'inline'}, child.props.style);

            return (
                <div key={index} style={style}>
                    {child}
                </div>
            );

        });

        var style = Object.assign({}, {textAlign:'center'}, this.props.style);

        return (
            <div style={style}>
                {children}
            </div>

        );
    }

};
