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
            responsive : false,
            size       : 'md',
            style      : {width:'100%'}
        };
    }


    render() {
        var {style, responsive, className, striped, dark, hover, bordered, borderless, size, ...props} = this.props;

        className = classNames(className, 'table');
        className = classNames(className, striped    ? 'table-striped'       : false);
        className = classNames(className, hover      ? 'table-hover'         : false);
        className = classNames(className, dark       ? 'table-dark'          : false);
        className = classNames(className, bordered   ? 'table-bordered'      : false);
        className = classNames(className, borderless ? 'table-borderless'    : false);
        className = classNames(className, size       ? 'table-' + size       : false);

        var table = (
            <table {...props} className={className} style={style}>
                {this.props.children}
            </table>
        );

        if (responsive) {
            var wrapperClassName = typeof responsive == 'string' ? 'table-responsive-' + responsive : 'table-responsive';

            table = (
                <div className={wrapperClassName}>
                    {table}
                </div>
            );

        }

        return table;
    }
};

Table.Row = (props) => {

    var {className, bg, color, ...other} = props;

    className = classNames(className, {[`table-${color}`]:color});

    return <Tag tag='tr' className={className} {...other}/>
}

Table.Col = function(props)  {
    var {className, header, color, ...other} = props;

    className = classNames(className, {[`table-${color}`]:color});

    return <Tag tag = {header ? 'th' : 'td'} className={className} {...other}/>;
}

Table.Header = function(props)  {
    var {className, light, dark, ...other} = props;

    className = classNames(className, {'thead-dark': dark});
    className = classNames(className, {'thead-light': light});

    return <Tag tag='thead' className={className} {...other}/>
}

Table.Body = function(props)  {
    return <Tag tag='tbody' {...props}/>
}
