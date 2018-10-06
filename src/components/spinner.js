import React from 'react';
import Loader from 'react-spinners/PulseLoader';


export default class Spinner extends React.Component {


    constructor(args) {
        super(args);
    }


    componentDidMount() {
    }

    render() {
        var {size, color, style, ...props} = this.props;


        if (!style) {
            style = {};
            style.textAlign = 'center';
            style.display = 'flex';
            style.justifyContent = 'center';
        }

        if (!size)
            size = 20;

        if (!color)
            color = 'lightblue';

        return (
            <div {...props} style={style}>
                <Loader size={size} loading={true} color={color}/>
            </div>
        );
    }
}
