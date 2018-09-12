import React from 'react';



export default class Icon extends React.Component {

    render() {
        var {icon, style, ...props} = this.props;

        return (
            <i className={'icon-'+icon} {...props} style={style} />
        );

    }

};
