import React from 'react';
import Component from './component.js';
import classNames from 'classnames';

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

    render() {

        var {className, ...props} = this.props;

        className = classNames(className, 'form-group');

        return (
            <div {...props} className={className}>
                {this.props.children}
            </div>

        );
    }

}

Form.Label = class extends Component {

    render() {

        var {className, ...props} = this.props;

        className = classNames(className, null);

        return (
            <label {...props} className={className}>
                {this.props.children}
            </label>

        );
    }

}

Form.Input = class extends Component  {

    static get defaultProps() {
        return {
            type: 'text'
        };
    }

    constructor(args) {
        super(args);

    }

    render() {

        var {className, ...props} = this.props;

        className = classNames(className, 'form-control');

        return (
            <input {...props} className={className}>
                {this.props.children}
            </input>

        );
    }

};
