import React, {Component} from 'react';

export default class Glyph extends Component {

    render() {
        var {name, glyph, icon, ...props} = this.props;

        if (icon && !name)
            name = icon;

        if (glyph && !name)
            name = glyph;

        return (
            <i className={'icon-'+name} {...props}/>
        );

    }

};
