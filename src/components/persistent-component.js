import React from 'react';

export default class PersistentComponent extends React.Component {

    constructor(props) {

        super(props);

        this.state = this.loadState();
    }

    componentWillUnmount() {
        this.saveState();
    }

    getPersistentKey() {
        console.warn('getPersistantKey() in component should be implemented.')
    }

    getDefaultState() {
        console.warn('getDefaultState() in component should be implemented.')
        return {};
    }

    loadState() {

        var state = null;

        try {
            state = JSON.parse(localStorage.getItem(this.getPersistentKey()));
        }
        catch (error) {
        }

        if (!state)
            state = this.getDefaultState();

        return state;
    }

    saveState() {
        localStorage.setItem(this.getPersistentKey(), JSON.stringify(this.state));
    }
}
