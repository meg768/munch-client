import React from 'react';
import classNames from 'classnames';
import Tag from 'react-bootify';

var _glyphs = {};

export default function Glyph(props) {

    var {tag, className, name, glyph, icon, ...other} = props;

    if (icon && !name)
        name = icon;

    if (glyph && !name)
        name = glyph;

    var svg = _glyphs[name];
    console.log('glyf', name, svg);
    return (
        <img src={svg} {...other}/>
    );
}

Glyph.defaultProps = {
    tag: 'i',
    prefix: 'icon-'
};


Glyph.add = function(name, svg) {
    console.log('adding', name, svg)
    _glyphs[name] = svg;
}
