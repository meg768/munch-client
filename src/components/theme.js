import React, {Component} from 'react';
import PropTypes from 'prop-types';

require('bootswatch/dist/materia/bootstrap.min.css');

export default class Theme extends Component {


    static defaultProps = {
        name: null
    };

    constructor(props) {
        super(props);

    }

    render() {
        return this.props.children;
    }
}
