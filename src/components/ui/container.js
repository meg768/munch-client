import React from 'react';
import Component from './component.js';
import PropTypes from "prop-types";
import classNames from 'classnames';


export default class Container extends Component  {


    static propTypes = {
        fluid : PropTypes.bool
    };

    static get defaultProps() {
        return {
            fluid: false
        };
    }

    constructor(props) {
        super(props);
    }


    render() {
        var {className, fluid, ...props} = this.props;

        className = classNames(className, fluid ? 'container-fluid' : 'container');

        return (
            <div className={className} {...props}>
                {this.props.children}
            </div>
        );
    }
};

Container.Row = class extends Component {

    static get defaultProps() {
        return {
        };
    }

    render() {
        var {className, ...props} = this.props;

        className = classNames(className, 'row');

        return (
            <div className={className} {...props}>
                {this.props.children}
            </div>
        );
    }
}

Container.Col = class extends Component {


    static get defaultProps() {
        return {
            size: 'sm'
        };
    }

    render() {
        var {xs, sm, md, lg, xl, className, ...props} = this.props;

        className = classNames(className, xs ? 'col-'    + xs : false);
        className = classNames(className, sm ? 'col-sm-' + sm : false);
        className = classNames(className, md ? 'col-md-' + md : false);
        className = classNames(className, lg ? 'col-lg-' + lg : false);
        className = classNames(className, xl ? 'col-xl-' + xl : false);

        return (
            <div className={className} {...props}>
                {this.props.children}
            </div>
        );
    }
}
