import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

export default class Button extends Component  {


    static propTypes = {
        color      : PropTypes.string,
        tag        : PropTypes.string,
        onClick    : PropTypes.func,
        disabled   : PropTypes.bool,
        modifiers  : PropTypes.object,
        placement  : PropTypes.string
    };

    static get defaultProps() {
        return {
            color    : 'primary',
            tag      : 'button',
            disabled : false
        };
    }
    constructor(args) {
        super(args);

        this.onClick = this.onClick.bind(this);
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

        var className = 'btn';
        var {tag : Tag, color, ...props} = this.props;

        if (color) {
            className = classNames(className, 'btn-' + color);
        }

        if (!Tag) {
            Tag = props.href ? 'a' : 'button';
        }

        // If a href is given and tag is 'button', replace with 'a'
        if (props.href && Tag === 'button') {
            Tag = 'a';
        }
        console.log({...props});

        return (
            <Tag {...props} className={className} onClick={this.onClick}>
                {this.props.children}
            </Tag>

        );
    }

};
