import classnames from "classnames";
import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

import { Manager, Reference, Popper } from "react-popper";
import {isArray} from 'yow/is';
import onClickOutside from 'react-onclickoutside';
import ClickOutside from './click-outside.js';



export default class Dropdown extends React.Component {

    static placementPositions = [
      "bottom",
      "bottom-end",
      "bottom-start",
      "left",
      "left-end",
      "left-start",
      "right",
      "right-end",
      "right-start",
      "top",
      "top-end",
      "top-start"
    ];


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



Dropdown.Target = class extends React.Component {

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


Dropdown.Content = class extends React.Component {


    static propTypes = {
        className  : PropTypes.string,
        isOpen     : PropTypes.bool,
        toggle     : PropTypes.func.IsRequired,
        modifiers  : PropTypes.object,
        placement  : PropTypes.oneOf(Dropdown.placementPositions)
    };

    constructor(props) {
        super(props);

    }

    static get defaultProps() {
        return {
            isOpen: false,
            modifiers: {
                preventOverflow: {
                    enabled: true,
                    escapeWithReference: true,
                    boundariesElement: "viewport"
                }
            },
            placement: "bottom-start"
        };
    }

    render() {

        if (this.props.isOpen) {

            return (
                <ClickOutside onClickOutside={this.props.toggle}>
                    <Popper modifiers={this.props.modifiers} placement={this.props.placement}>
                    {({ref, style, placement, arrowProps}) => (
                        <div ref={ref} style={style} data-placement={placement}>
                            {this.props.children}
                        </div>
                    )}
                    </Popper>


                </ClickOutside>
            );
        }
        else {
            return null;
        }


    }

}
