import React, {Component} from 'react';
import classNames from 'classnames';

export default class Glyph extends Component {

    render() {
        var {className, name, glyph, icon, ...props} = this.props;

        if (icon && !name)
            name = icon;

        if (glyph && !name)
            name = glyph;

        return (
            <i className={classNames(className, 'icon-'+name)} {...props}/>
        );

    }

};
