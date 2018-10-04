import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

export default class Button extends Component  {

    constructor(args) {
        super(args);

        this.onClick = this.onClick.bind(this);
    }


    static propTypes = {
        color      : PropTypes.string,
        tag        : PropTypes.string,
        onClick    : PropTypes.func,
        disabled   : PropTypes.bool
    };

    static get defaultProps() {
        return {
            color    : 'primary',
            tag      : 'button',
            disabled : false
        };
    }

    onClick(event) {
        if (this.props.disabled) {
            event.preventDefault();
            return;
        }

        if (this.props.onClick) {
            this.props.onClick(event);
        }

    }

    render() {

        var {tag : Tag, className, color, ...props} = this.props;

        className = classNames(className, 'btn');
        className = classNames(className, {[`btn-${color}`]:color});


        if (!Tag) {
            Tag = props.href ? 'a' : 'button';
        }

        // If a href is given and tag is 'button', replace with 'a'
        if (props.href && Tag === 'button') {
            Tag = 'a';
        }

        return (
            <Tag {...props} className={className} onClick={this.onClick}>
                {this.props.children}
            </Tag>

        );
    }

};
