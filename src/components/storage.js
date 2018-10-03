import React from 'react';

export class Storage  {

    constructor(key) {
        this.key = key;
    }

    load(defaultValue) {

        var value = null;

        try {
            value = JSON.parse(localStorage.getItem(this.key));
        }
        catch (error) {
        }

        if (value == null)
            value = {};

        return Object.assign({}, defaultValue, value);

    }

    save(value) {
        localStorage.setItem(this.key, JSON.stringify(value));
    }
}
