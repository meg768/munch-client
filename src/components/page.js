import React from 'react';




export default class Page extends React.Component {

    render() {
        var style = {};
        style.margin = '1em';
        return (
            <div style={style}>
                {this.props.children}
            </div>

        );
    }
}
