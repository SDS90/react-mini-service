//Блок формы

import React, { Component } from 'react';
import Input from "./input-block";
import {validForm} from "../utilities/validation";

export default class Form extends React.Component {

	constructor(props) {
        super(props);
        this.state = {...props};          
    }

    render() {
        return (
            <div className="reg-form-page">
				<div className="reg-form-wrapper">
					<h2>{this.state.title}</h2>
					<form className="reg-form" id={this.state.id}>
						<fieldset>
							<div className="loading-form-block"></div>
							<div className="reg-form-fieldset">{this.state.inputs}</div>
							<div className="form-block info-block">{this.state.infoData}</div>
							<div className="form-block buttons-wrapper">{this.state.buttons}</div>
						</fieldset>
					</form>
				</div>
			</div>
        )
    }
}

export function onSubmitForm(selector, callback) {
	const form = document.querySelector(selector);
	if (!form) return;

	if (validForm(form)){
		const formData = new FormData(form);
		let obj = {};
		for (let key of formData.keys()) {
			obj[key] = formData.get(key);
		}
		if (callback){
			callback(obj);
		}
	}
	return;
}