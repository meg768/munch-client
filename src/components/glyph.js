import React from 'react';
import classNames from 'classnames';
import {Tag} from 'react-bootify';

var _glyphs = {};

export default class Glyph extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var svg = this.props.svg; //require('../glyphs/' + this.props.name + '.svg');
        var svgURL = 'url(' + svg + ')';
        var style = {};
        
        style.textColor = 'inherit';
        style.maskImage = svgURL;
        style.maskRepeat = 'no-repeat';
        style.WebkitMaskImage = svgURL;
        style.WebkitMaskRepeat = 'no-repeat';
        style.display = 'inline';
        //style.width = '2rem';
        //style.height = '2rem';

        return (
            <Tag  style={style}   backgroundColor='primary'>
                &nbsp;XXX
            </Tag>
        );

        return (
            <Tag tag='img' src={svg} textColor='primary'/>
        );

        return (
            <img src={svg}/>

        );

    }
}

