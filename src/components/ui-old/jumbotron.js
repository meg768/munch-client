import React from 'react';
import Component from './component.js';
import PropTypes from "prop-types";
import classNames from 'classnames';

function debug() {
    console.log.apply(null, arguments);
}

export default class Template extends Component  {

    static propTypes = {
        className : PropTypes.string
    };

    static get defaultProps() {
        return {
            className: 'jumbotron'
        };
    }

    constructor(props) {
        super(props);
    }

    render() {

        var {className, ...props} = this.props;

        return (
            <div className={className} {...props}>
            </div>
        );
    }
};
