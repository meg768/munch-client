import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Theme extends Component {


    static defaultProps = {
        name: 'materia'
    };

    constructor(props) {
        super(props);

        require('bootswatch/dist/' + this.props.name + '/bootstrap.min.css');
    }

    render() {
        return this.props.children;
    }
}
