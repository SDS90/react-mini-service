//Блок кнопки

import React, { Component } from 'react';

export default class Button extends React.Component {

	constructor(props) {
		super(props);
		this.state = {...props}; 
	}

	render() {
        return (<button id={this.state.id} className={this.state.classes} onClick={(e) => this.state.onClick(e)}>{this.state.name}</button>)
    }
}