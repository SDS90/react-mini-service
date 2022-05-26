//Блок input

import React, { Component } from 'react';
import {validValue} from "../utilities/validation";

export default class Input extends React.Component {

	constructor(props) {
		super(props);
		this.state = {...props}; 
	}

	render() {
        return (
            <div className={this.state.classList}>
				<label className="form-label" htmlFor={this.state.id}>{this.state.label}</label>
				<div className="input-wrapper">
					<input className="form-control input-styles" data-required={this.state.required} data-error-text={this.state.errorText} 
					data-validation-type={this.state.validationType} id={this.state.id} type={this.state.type} name={this.state.name} onChange={e => this.onChangeInput(e.target)}/>
					<div className="error-text-block"></div>
				</div>
			</div>
        )
    }

    onChangeInput(input){
    	validValue(input)
    }
}