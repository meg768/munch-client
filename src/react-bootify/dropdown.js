import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import classNames from 'classnames';
import PopperJs from 'popper.js';
import Tag from './tag.js';
import Component from './component.js'
function debug() {
    console.log.apply(null, arguments);
}

export default class Dropdown extends Component {

    constructor(args) {
        super(args);

        this.state = {popper:null};

        this.popper     = null;
        this.targetNode = null;
        this.dropdownNode  = null;

        this.onDocumentClick = this.onDocumentClick.bind(this);

    }

    static propTypes = {
        toggle : PropTypes.func,
        isOpen : PropTypes.bool
    };

    static defaultProps() {
        return {
            placement: 'bottom-start',
            isOpen : false,
            toggle : null,
            modifiers: {
                preventOverflow: {
                    boundariesElement: 'viewport',
                }
            }
        };
    }


    componentDidMount() {

        if (this.props.toggle)
            document.addEventListener('click', this.onDocumentClick, true);

        this.createPopper();
    }

    componentWillReceiveProps() {
        if (!this.popper) {
            this.createPopper();
        }
        this.updatePopper();
    }

    componentWillUnmount() {

        if (this.props.toggle)
            document.removeEventListener('click', this.onDocumentClick, true);

        this.destroyPopper();
    }

    onDocumentClick(event) {

        if (this.props.isOpen) {
            if (this.props.toggle && !this.dropdownNode.contains(event.target)) {
                this.props.toggle();
            }

        }
    }

    createPopper() {
        var options = {
            placement : this.props.placement,
            modifiers : this.props.modifiers,
            onCreate  : (state) => {this.setState({popper:state})},
            onUpdate  : (state) => {this.setState({popper:state})}

        };

        this.popper = new PopperJs(this.targetNode, this.dropdownNode, options);

        this.updatePopper();
    }

    destroyPopper() {
        if (this.popper) {
            this.popper.destroy();
        }

    }


    updatePopper() {
        requestAnimationFrame(() => {
            if (this.popper) {
                this.popper.update();
            }
        });
    }


    getDropdownTarget() {
        return React.Children.toArray(this.props.children).find((child) => {
            return child.type === Dropdown.Target;
        })
    }

    getDropdownMenu() {
        return React.Children.toArray(this.props.children).find((child) => {
            return child.type === Dropdown.Menu;
        });
    }


    renderDropdownTarget() {
        var target = this.getDropdownTarget();
        return (React.cloneElement(target, {ref:(element) => {this.targetNode = ReactDOM.findDOMNode(element)}}));
    }

    renderDropdownMenu() {
        var menu = this.getDropdownMenu();
        return (React.cloneElement(menu, {isOpen:this.props.isOpen, ref:(element) => {this.dropdownNode = ReactDOM.findDOMNode(element)}}));
    }


    render() {
        var {tag = 'div', isOpen, toggle, ...props} = this.props;

        return (
            <Tag tag={tag} {...props}>
                {this.renderDropdownTarget()}
                {this.renderDropdownMenu()}
            </Tag>
        );

    }
}




Dropdown.Target = class extends React.Component {

    render() {

        return (
            this.props.children
        );

    }
}


Dropdown.Menu = class extends React.Component {


    static propTypes = {
        isOpen : PropTypes.bool
    };


    static get defaultProps() {
        return {
            isOpen : false
        };
    }

    render() {

        var {tag = 'div', style, isOpen, className, ...props} = this.props;

        className = classNames(className, 'dropdown-menu show');
        style = Object.assign({}, style, {display:isOpen ? 'block' : 'none'});

        return (
            <Tag tag={tag} style={style} className={className} {...props}/>
        );

    }
}



Dropdown.Item = function(props) {

    var {tag = 'div', style, className, ...other} = props;

    className = classNames(className, 'dropdown-item');
    style = Object.assign({}, style, {cursor:'pointer'});

    return (
        <Tag tag={tag} style={style} className={className} {...other}/>
    );
}
//Dropdown.Item.defaultStyle = {};

Dropdown.Separator = function(props) {

    var {tag = 'div', className, ...other} = props;

    className = classNames(className, 'dropdown-divider');

    return (
        <Tag tag={tag} className={className} {...other}/>
    );
}
