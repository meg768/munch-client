import React, {Component} from 'react';
import classNames from 'classnames';
import Tag from './tag.js';


export default function(props) {

    var {tag = 'i', className, name, glyph, icon, ...props} = props;

    if (icon && !name)
        name = icon;

    if (glyph && !name)
        name = glyph;

    return (
        <Tag tag={tag} className={classNames(className, 'icon-'+name)} {...props}/>
    );
}
