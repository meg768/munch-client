import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';
import Component from './component.js';
import Tag from './tag.js';


export default class Alert extends Component  {

    constructor(props) {
        super(props);

        this.state = {};
        this.state.dismissed = false;

        this.onDismiss = this.onDismiss.bind(this);
    }

    static propTypes = {
        color : PropTypes.string
    };

    static defaultProps = {
        color       : 'info',
        role        : 'alert',
        tag         : 'div',
        dismissable : false
    };

    onDismiss() {
        this.setState({dismissed:true});
    }

    render() {
        if (this.state.dismissed)
            return null;

        var {dismissable, tag, color, role, children, className, ...props} = this.props;

        className = classNames(className, {'alert': true});
        className = classNames(className, {'alert-dismissible': dismissable});
        className = classNames(className, {[`alert-${color}`]:color});

        var dismiss = null;

        if (dismissable) {
            dismiss = (
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={this.onDismiss}>
                    <span aria-hidden="true">&times;</span>
                </button>
            );
        }


        return (
            <Tag tag={tag} className={className} role={role} {...props}>
                {dismiss}
                {children}
            </Tag>

        );

    }
};


Alert.Heading = function(props) {

    var {tag, className, ...other} = props;

    className = classNames(className, 'alert-heading');

    return <Tag tag={tag} className={className} {...other}/>;
}

Alert.Heading.defaultProps = {
    tag: 'h4'
};
