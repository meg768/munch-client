import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import classNames from 'classnames';
import PopperJs from 'popper.js';

function debug() {
    console.log.apply(null, arguments);
}




export default class Popover extends React.Component {

    constructor(args) {
        super(args);

        this.state = {popper:null};

        this.popper = null;
        this.targetNode = null;
        this.popupNode = null;
        this.arrowNode = null;

        this.onDocumentClick = this.onDocumentClick.bind(this);

    }

    static propTypes = {
        target : PropTypes.element.isRequired,
        arrow : PropTypes.bool,
        placement : PropTypes.string,
        toggle : PropTypes.func
    };

    static get defaultProps() {
        return {
            placement: 'bottom-start',
            isOpen : false,
            arrow: true,
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

        var modifiers = {
            arrow: {element:this.arrowNode}
        };

        var options = {
            placement : this.props.placement,
            modifiers : modifiers,
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


        var popoverClassName = 'popover fade show';
        var popoverStyle = {};

        if (this.state.popper) {

            switch (this.state.popper.placement) {
                case 'left':
                case 'left-start':
                case 'left-end': {
                    popoverClassName = classNames(popoverClassName, 'bs-popover-left');
                    break;
                }
                case 'right':
                case 'right-start':
                case 'right-end': {
                    popoverClassName = classNames(popoverClassName, 'bs-popover-right');
                    break;
                }
                case 'top':
                case 'top-start':
                case 'top-end': {
                    popoverClassName = classNames(popoverClassName, 'bs-popover-top');
                    break;
                }
                case 'bottom':
                case 'bottom-start':
                case 'bottom-end': {
                    popoverClassName = classNames(popoverClassName, 'bs-popover-bottom');
                    break;
                }
            }

            popoverStyle.display = this.props.isOpen ? 'block' : 'none';

        }
        else {
            popoverStyle.display = 'none';
        }

        var arrow = null;

        if (this.props.arrow) {
            arrow = (
                <div className='arrow' ref={(element) => {this.arrowNode = element}}>
                </div>
            );
        }
        return (
            <div className={popoverClassName}  style={popoverStyle} ref={(element) => {this.popupNode = element}}>
                {arrow}
                {this.props.children}
            </div>
        );

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




Popover.Body = class extends React.Component {


    render() {
        var {className, props} = this.props;

        return (
            <div className={classNames(className, 'popover-body')} {...props}>
                {this.props.children}
            </div>
        );
    }

}


Popover.Header = class extends React.Component {

    render() {
        var {className, props} = this.props;

        return (
            <div className={classNames(className, 'popover-header')} {...props}>
                {this.props.children}
            </div>
        );
    }

}
