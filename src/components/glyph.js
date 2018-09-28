import React from 'react';



export default class Icon extends React.Component {

    render() {
        var {icon, style, fontSize, ...props} = this.props;

        style = style || {};


        return (
            <i className={'icon-'+icon} {...props} style={style} />
        );

    }

};
