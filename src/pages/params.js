import React from 'react';




class Module extends React.Component {


    constructor(args) {

        super(args);

        console.log('args', args.match.params);
        this.params = args.match.params;
        this.state = {};
        this.state.ready = false;
        this.state.stocks = [];
        this.onClick = this.onClick.bind(this);
    }


    componentDidMount() {
    console.log(this.props.location.query);
    }

    onClick() {


    }

    renderList() {
        console.log(this.params);
        return(
            <p>
                {this.params.id}
            </p>
        );
    }

    render() {
        return (
            <div>
                {this.renderList()}
            </div>
        );
    }
}

export default Module;
