import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

import Component from './component.js';

var _uniqueID = 0;

function getUniqueID() {
    return 'A' + _uniqueID++;
}


export default class Form extends Component  {

    static get defaultProps() {
        return {
        };
    }

    constructor(args) {
        super(args);
    }

    render() {

        var {className, ...props} = this.props;

        className = classNames('form', className);

        return (
            <form {...props} className={className}>
                {this.props.children}
            </form>

        );
    }

};


Form.Group = class extends Component  {

    static propTypes = {
        xs    : PropTypes.number,
        sm    : PropTypes.number,
        md    : PropTypes.number,
        lg    : PropTypes.number,
        width : PropTypes.number
    };

    render() {

        var {className, xs, sm, md, lg, width, ...props} = this.props;

        className = classNames(className, 'form-group');

        className = classNames(className, {width:width});
        className = classNames(className, {[`col-${xs}`]:xs});
        className = classNames(className, {[`col-sm-${sm}`]:sm});
        className = classNames(className, {[`col-md-${md}`]:md});
        className = classNames(className, {[`col-lg-${lg}`]:lg});

        return (
            <div {...props} className={className}>
                {this.props.children}
            </div>

        );
    }

}

Form.Row = class extends Component {

    render() {

        var {className, ...props} = this.props;
        className = classNames(className, 'form-row');

        return (
            <div {...props} className={className}>
                {this.props.children}
            </div>

        );
    }

}

Form.Col = class extends Component {

    render() {

        var {className, ...props} = this.props;
        className = classNames(className, 'col');

        return (
            <div {...props} className={className}>
                {this.props.children}
            </div>

        );
    }

}
Form.Input = class extends React.Component  {


    static propTypes = {
        plainText : PropTypes.bool
    };

    static get defaultProps() {
        return {
            type: 'text'
        };
    }

    render() {

        var {plainText, className, ...props} = this.props;

        className = classNames(className, {'form-control':true});
        className = classNames(className, {'form-control-plainText':plainText});

        return (
            <input {...props} className={className}>
                {this.props.children}
            </input>

        );
    }

};


Form.Label = class extends React.Component  {

    render() {
        return (
            <label {...this.props}>
                {this.props.children}
            </label>

        );
    }

};
