import Component from './component.js';

import onClickOutside from 'react-onclickoutside';


class MyComponent extends Component {


    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }


    handleClickOutside() {
        this.props.onClickOutside();
    }


    render() {
        return this.props.children;
    }
}

export default onClickOutside(MyComponent);
