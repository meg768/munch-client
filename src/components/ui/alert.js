import React from 'react';
import Component from './component.js';
import PropTypes from "prop-types";
import classNames from 'classnames';


export default class Alert extends Component  {

    static propTypes = {
        color      : PropTypes.string
    };

    static get defaultProps() {
        return {
            color  : 'primary',
            role   : 'alert'
        };
    }

    constructor(props) {
        super(props);
    }

    render() {
        var {color, className, ...props} = this.props;

        if (!className)
            className = 'alert';

        if (color) {
            className = classNames(className, 'alert-' + color);
        }

        console.log('className', className);

        return (
            <div className={className} {...props}>
                {this.props.children}
            </div>
        );
    }
};
