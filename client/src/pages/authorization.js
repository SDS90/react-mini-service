//Страница авторизации

import React, { Component } from 'react';
import { Navigate, useNavigate   } from 'react-router-dom';
import Form, { FormParams, onSubmitForm } from '../elements/form-block';
import Input from '../elements/input-block';
import Button from '../elements/button-block';
import {createRequest} from "../utilities/transfer";
//import registration from './registration';
//import { chat } from './chat';

const authorizationFormInputs = [
   {
		id: 'login',
		name: 'login',
		label: 'Логин',
		value: '',
		type: 'text',
		required: true,
		errorText: 'Обязательное поле',
		validationType: '',
		classList: '',
	},
	{
		id: 'password',
		name: 'password',
		label: 'Пароль',
		value: '',
		type: 'password',
		required: true,
		errorText: 'Обязательное поле',
		validationType: '',
		classList: '',
	},
];

export default class AuthorizationPage extends React.Component {

	authorizationButtons = [
		{
			id: 'authorizationButton',
			name: 'Войти',
			classes: 'add-link',
			onClick: (event) => {
				event.preventDefault();
				this.submitAuthorizationForm(true, '/phones');
			},
		},
		{
			id: 'registrationButton',
			name: 'Зарегистрироваться',
			classes: 'reg-link',
			onClick: (event) => {
				event.preventDefault();
				this.setState({
		            redirect: true,
		        	linkToRedirect: '/registration',
		        });
			},
		},
	]

	constructor(props) {
        super(props);
        this.state = {...props};
        this.state.infoData = '';
        this.state.redirect = false;
        this.state.linkToRedirect = '';
        this.state.loadingClass = '';      
    }

	submitAuthorizationForm(value, link){
		const $this = this;
		onSubmitForm('#authorizationForm', function(data){
			const infoBlock = document.getElementById('authorizationForm').querySelector('.info-block');
			const loadingBlock = document.getElementById('authorizationForm').querySelector('.loading-form-block');

			loadingBlock.classList.add('loading-form-class');
			
			createRequest('/userAuthorization', 'POST', JSON.stringify(data), function(request){
				loadingBlock.classList.remove('loading-form-class');
				if (request.response){
					infoBlock.textContent = "";
					localStorage.setItem('login', data.login);
        			$this.setState({
			            redirect: value,
			        	linkToRedirect: link,
			        });
				} else {
					if (request.error){
						infoBlock.textContent = request.error;
					} else {
						infoBlock.textContent = "Пользователь не найден";
					}
				}
			});
		});	        
    }

    renderRedirect(){
    	if (this.state.redirect) {    		
    		const link = this.state.linkToRedirect;
            return <Navigate to = {link} />
        }
    }

    render() {
    	if (localStorage.getItem('login')){
    		return <Navigate to = '/phones' />
    	}

    	document.title = "Вход";

    	const authorizationFormInputsBlock = authorizationFormInputs.map(input => {
    		let classList = "form-block " + input.classList;
	    	return <Input key={input.id} id={input.id} label={input.label} type={input.type} classList={classList}
	    	name={input.name} value={input.value} required={input.required} errorText={input.errorText} 
	    	validationType={input.validationType}
	    	 />;
	   	});

    	const authorizationFormButtonsBlock = this.authorizationButtons.map(button => {
    		let classList = "button-link " + button.classes;
	    	return <div key={button.id}><Button classes={classList} name={button.name} onClick={button.onClick} /></div>;
	   	});
	    return (
        	<div>
	        	{this.renderRedirect()}
	        	<Form id={this.state.id} loadingClass={this.state.loadingClass} title={this.state.title} infoData={this.state.infoData} inputs={authorizationFormInputsBlock} buttons={authorizationFormButtonsBlock} />
	        </div>
        )
    }
}