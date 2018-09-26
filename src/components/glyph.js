import React from 'react';



export default class Icon extends React.Component {

    render() {
        var {icon, style, fontSize, ...props} = this.props;

        style = style || {};

//        if (!style.fontSize)
//            style.fontSize = '150%';

///        style.verticalAlign = 'middle';

        return (
            <i className={'icon-'+icon} {...props} style={style} />
        );

    }

};
