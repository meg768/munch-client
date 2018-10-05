import classnames from "classnames";
import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import ClickOutside from './click-outside.js';
import { Manager, Reference, Popper } from "react-popper";

function debug() {
    console.log.apply(null, arguments);
}

export default class Popup extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Manager>
                {this.props.children}
            </Manager>
        );
    }
}



Popup.Target = class extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Reference>
                {({ ref, style }) => (
                    <div ref={ref} style={style}>
                        {this.props.children}
                    </div>
                )}
            </Reference>
        );

    }
}


Popup.Content = class extends React.Component {


    static propTypes = {
        className  : PropTypes.string,
        isOpen     : PropTypes.bool,
        toggle     : PropTypes.func.isRequired,
        persist    : PropTypes.bool,
        modifiers  : PropTypes.object,
        placement  : PropTypes.string
    };

    constructor(props) {
        super(props);

    }

    static get defaultProps() {
        return {
            isOpen: false,
            persist: false,
            modifiers: {
                flip: {
                    enabled:true,
                    boundariesElement: "viewport"
                },
                preventOverflow: {
                    enabled: true,
                    escapeWithReference: true,
                    boundariesElement: "scrollParent"
                }
            },
            placement: "bottom-start"
        };
    }

    renderPopper() {

        return (
            <Popper modifiers={this.props.modifiers} placement={this.props.placement}>
            {
                ({ref, style, placement, arrowProps}) => {

                    console.log('arrowProps', arrowProps);
                    console.log('placement', placement);

                    return (
                        <div ref={ref} style={Object.assign({}, style, {zIndex:1000})} data-placement={placement}>
                            {this.props.children}
                        </div>

                    );
                }
            }
            </Popper>

        );
    }
    render() {

        if (this.props.isOpen) {

            if (this.props.persist)
                return this.renderPopper();

            return (
                <ClickOutside onClickOutside={this.props.toggle}>
                    {this.renderPopper()}
                </ClickOutside>
            );
        }
        else {
            return null;
        }


    }

}
