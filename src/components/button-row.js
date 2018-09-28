import React from 'react';

export default class ButtonRow extends React.Component  {

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
