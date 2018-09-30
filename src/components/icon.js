import React from 'react';



export default class Icon extends React.Component {

    render() {
        var {size, icon, style, ...props} = this.props;

        if (size) {
            style = Object.assign({}, {fontSize:size}, style)
        }



        return (
            <i className={'icon-'+icon} {...props} style={style} />
        );

    }

};
