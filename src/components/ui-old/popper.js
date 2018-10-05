
// NOTE: This component requires React 16 or newer.

// Usage:
/*
<Position
    parent={<div>Parent element</div>}
    target={ (style) => (
        <div style={style}>Popper element</div>
    )}
    options={{
        placement : 'top'
    }}
/>
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PopperJS from 'popper.js';

class Parent extends Component {
    render(){
        return this.props.children;
    }
}

class Target extends Component {
    render(){
        return this.props.children(this.props.style);
    }
}

class PopperComponent extends Component {

    state = {}

    componentDidMount() {
        if ( ReactDOM.findDOMNode(this.target) ) { this.initPopper() }
    }

    componentDidUpdate(){
        if ( this.popperInstance ) {
            this.popperInstance.update();
        }
    }

    componentWillUnmount() {
        if ( this.popperInstance ) {
            this.popperInstance.destroy();
        }
    }

    initPopper() {

        if ( !ReactDOM.findDOMNode(this.target) ) { return }

        // Add position absolute to the popper element for proper positioning.
        ReactDOM.findDOMNode(this.target).setAttribute('style','position:absolute');

        this.popperInstance = new PopperJS(
            ReactDOM.findDOMNode(this.parent),
            ReactDOM.findDOMNode(this.target),
            {
                ...this.props.options, // Spread the options provided to the component
                modifiers : {
                    applyStyle: {enabled : false},
                    updateStateWithStyle: {
                        enabled : true,
                        fn : this.update,
                    }
                }
            }
        );
    }

    update = (data) => {
        this.setState(data);
        return data; // Important! Return data to popper
    }

    getStyle = (data) => {

        if ( !data || !data.offsets || !data.offsets.popper ) { return }

        const left = data.offsets.popper.left;
        const top = data.offsets.popper.top;
        const transform = `translate3d(${left}px, ${top}px, 0)`;

        return {
            position: data.offsets.popper.position,
            transform,
            WebkitTransform: transform,
            top: 0,
            left: 0,
            willChange: 'transform'
        }

    }


    render(){
        return ([

            <Parent
                ref={ (el) => this.parent = el }
                key={0}
            >
                {this.props.parent}
            </Parent>,

            <Target
                ref={ (el) => this.target = el }
                key={1}
                style={this.getStyle(this.state)}
            >
                {this.props.target}
            </Target>,

        ])
    }
}

export default PopperComponent;
