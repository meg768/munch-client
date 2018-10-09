import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';

import Component from './component.js';
import Tag from './tag.js';

export default class Table extends Component  {

    static propTypes = {
        borderless : PropTypes.bool,
        bordered   : PropTypes.bool,
        striped    : PropTypes.bool,
        dark       : PropTypes.bool,
        size       : PropTypes.string

    };

    static get defaultProps() {
        return {
            striped    : true,
            dark       : false,
            bordered   : false,
            borderless : false,
            size       : 'md',
            style      : {width:'100%'}
        };
    }


    render() {
        var {style, className, striped, dark, hover, bordered, borderless, size, ...props} = this.props;

        className = classNames(className, 'table');
        className = classNames(className, striped    ? 'table-striped'       : false);
        className = classNames(className, hover      ? 'table-hover'         : false);
        className = classNames(className, dark       ? 'table-dark'          : false);
        className = classNames(className, bordered   ? 'table-bordered'      : false);
        className = classNames(className, borderless ? 'table-borderless'    : false);
        className = classNames(className, size       ? 'table-' + size       : false);

        return (
            <div className='table-responsive-sm'>
                <table {...props} className={className} style={style} >
                    {this.props.children}
                </table>
            </div>
        );
    }
};


Table.Row = (props) => {
    return <Tag tag='tr' {...props}/>
}

Table.Col = function(props)  {
    const {header, ...other} = props;
    return header ? <Tag tag='th' {...other}/> : <Tag tag='td' {...other}/>;
}

Table.Header = function(props)  {
    return <Tag tag='thead' {...props}/>
}

Table.Body = function(props)  {
    return <Tag tag='tbody' {...props}/>
}
