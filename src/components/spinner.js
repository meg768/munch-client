import React from 'react';
import Loader from 'react-spinners/PulseLoader';


class Module extends React.Component {


    constructor(args) {
        super(args);
    }


    componentDidMount() {
    }

    render() {
        var style = {};
        style.textAlign = 'center';
        style.display = 'flex';
        style.justifyContent = 'center';
        style.alignItems = 'center';
        style.position = 'absolute';
        style.left = 0;
        style.right = 0;
        style.top = 0;
        style.bottom = 0;
        return (
                <div style={style}>
                    <Loader size='50' loading={true} color={'lightblue'}/>
                </div>
        );
    }
}

export default Module;
