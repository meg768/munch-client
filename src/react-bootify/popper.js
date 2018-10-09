import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import classNames from 'classnames';
import PopperJs from 'popper.js';

function debug() {
    console.log.apply(null, arguments);
}

export default class Popper extends React.Component {

    constructor(args) {
        super(args);

        this.state = {popper:null};

        this.popper = null;
        this.targetNode = null;
        this.popupNode = null;

        this.onDocumentClick = this.onDocumentClick.bind(this);
    }

    static propTypes = {
        target    : PropTypes.element.isRequired,
        placement : PropTypes.string,
        toggle    : PropTypes.func
    };

    static get defaultProps() {
        return {
            isOpen: false,
            placement: 'bottom-start',
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
        document.removeEventListener('click', this.onDocumentClick, true);

        this.destroyPopper();
    }

    createPopper() {
        var options = {
            placement : this.props.placement,
            modifiers : this.props.modifiers,
            onCreate  : (state) => {this.setState({popper:state})},
            onUpdate  : (state) => {this.setState({popper:state})}

        };

        this.popper = new PopperJs(this.targetNode, this.popupNode, options);

        this.updatePopper();
    }

    destroyPopper() {
        if (this.popper) {
            this.popper.destroy();
        }

    }

    onDocumentClick(event) {

        if (this.props.isOpen) {
            if (this.props.toggle && !this.popupNode.contains(event.target)) {
                this.props.toggle();
            }

        }
    }

    updatePopper() {
        requestAnimationFrame(() => {
            if (this.popper) {
                this.popper.update();
            }
        });
    }

    renderTarget() {

        return (React.cloneElement(this.props.target, {ref:(element) => {this.targetNode = ReactDOM.findDOMNode(element)}}));
    }


    renderPopup() {

        var children = React.Children.toArray(this.props.children);

        if (children.length == 1) {
            var child = children[0];
            var style = Object.assign({}, child.props.style, {display: this.state.popper && this.props.isOpen ? 'block' : 'none'});

            return React.cloneElement(child, {style:style, ref:(element) => {this.popupNode = ReactDOM.findDOMNode(element)}});
        }
    }

    render() {

        return (
            <div>
                {this.renderTarget()}
                {this.renderPopup()}
            </div>
        );

    }
}
