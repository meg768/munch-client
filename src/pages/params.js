import React from 'react';
import QueryString from 'query-string';



class Module extends React.Component {


    constructor(args) {

        super(args);

        console.log('args', args);
        this.state = {};
        this.state.ready = false;
        this.state.stocks = [];
        this.onClick = this.onClick.bind(this);
    }


    componentDidMount() {
        console.log('props', this.props);
        if (this.props.location.search) {
            var q = QueryString.parse(this.props.location.search);
            console.log('qs', q);

        }
        else {
            console.log('No params');
        }
    }

    onClick() {


    }

    renderList() {
        return(
            <p>
                HP
            </p>
        );
    }

    render() {
        return (
            <div>
            HEJ
                {this.renderList()}
            </div>
        );
    }
}

export default Module;
