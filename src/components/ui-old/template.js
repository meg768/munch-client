import React from 'react';
import Component from './component.js';
import PropTypes from "prop-types";
import classNames from 'classnames';


export default class Template extends Component  {

    static propTypes = {
        string     : PropTypes.string,
        bool       : PropTypes.bool,
        function   : PropTypes.func.IsRequired,
        persist    : PropTypes.bool,
        object     : PropTypes.object
    };

    static get defaultProps() {
        return {
        };
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <div>
            </div>
        );
    }
};
