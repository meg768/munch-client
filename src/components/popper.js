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
        this.referenceNode = null;
        this.popupNode = null;

        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    static propTypes = {
        popup : PropTypes.element.isRequired,
        placement : PropTypes.string
    };

    static get defaultProps() {
        return {
            placement: 'bottom-start',
            modifiers: {
                preventOverflow: {
                    boundariesElement: 'viewport',
                }
            }
        };
    }

    componentDidMount() {
        this.instantiatePopper();
    }

    componentWillReceiveProps() {
        if (!this.popper) {
            this.instantiatePopper();
        }
        this.updatePopper();
    }

    componentWillUnmount() {
        if (this.popper) {
            this.popper.destroy();
        }
    }

    instantiatePopper() {

        var options = {
            placement : this.props.placement,
            modifiers : this.props.modifiers,
            onCreate  : this.onCreate,
            onUpdate  : this.onUpdate

        };

        this.popper = new PopperJs(this.referenceNode, this.popupNode, options);

        this.updatePopper();
    }

    onCreate(state) {
        this.setState({popper:state});
    }

    onUpdate(state) {
        this.setState({popper:state});
    }

    updatePopper() {
        requestAnimationFrame(() => {
            if (this.popper) {
                this.popper.update();
            }
        });
    }


    getPopupStyle() {

        var style = {};
        var unit = '0.2rem';

        if (!this.state.popper)
            return {};

        debug(this.state.popper);
        style.display = this.props.isOpen ? 'block' : 'none';

        switch(this.state.popper.placement) {
            case 'bottom-start': {
                style.marginTop = unit;
                break;
            }
        }

        return style;
    }

    renderReference() {

        if (this.props.reference) {
            return (React.cloneElement(this.props.reference, {ref:(element) => {this.referenceNode = ReactDOM.findDOMNode(element)}}));
        }
        else {
            var children = React.Children.toArray(this.props.children);

            if (children.length > 1) {

                return (
                    <div ref={(element) => {this.referenceNode = ReactDOM.findDOMNode(element)}}>
                        {children}
                    </div>

                );
            }
            else {
                return (React.cloneElement(children[0], {ref:(element) => {this.referenceNode = ReactDOM.findDOMNode(element)}}));

            }

        }
    }



    renderPopup() {
        if (this.props.popup)
            return (React.cloneElement(this.props.popup, {style:this.getPopupStyle(), ref:(element) => {this.popupNode = ReactDOM.findDOMNode(element)}}));
        else
            return null;

    }


    render() {
        return (
            <div>
                {this.renderReference()}
                {this.renderPopup()}
            </div>
        );

    }
}



Popper.Reference = class extends React.Component {

    constructor(args) {
        super(args);

    }

    render() {
        return (
            <div/>
        );
    }

}


Popper.Popup = class extends React.Component {

    constructor(args) {
        super(args);

    }

    render() {
        return (
            <div/>
        );
    }
}
