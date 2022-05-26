//Страница регистрации

import React, { Component } from 'react';
import { Navigate, useNavigate   } from 'react-router-dom';
import Form, { FormParams, onSubmitForm } from '../elements/form-block';
import Input from '../elements/input-block';
import Button from '../elements/button-block';
import {createRequest} from "../utilities/transfer";
//import registration from './registration';
//import { chat } from './chat';

const registrationFormInputs = [
	{
		id: 'email',
		name: 'email',
		label: 'E-mail',
		value: '',
		type: 'text',
		required: true,
		errorText: 'Неверный формат email',
		validationType: 'email',
		classList: '',
	},
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
		id: 'secondName',
		name: 'second_name',
		label: 'Фамилия',
		value: '',
		type: 'text',
		required: true,
		errorText: 'Первая буква должна быть заглавной, без пробелов, цифр и спецсимволов, кроме дефиса',
		validationType: 'name',
		classList: '',
	},
	{
		id: 'firstName',
		name: 'first_name',
		label: 'Имя',
		value: '',
		type: 'text',
		required: true,
		errorText: 'Первая буква должна быть заглавной, без пробелов, цифр и спецсимволов, кроме дефиса',
		validationType: 'name',
		classList: '',
	},
	{
		id: 'patronymic',
		name: 'patronymic',
		label: 'Отчество',
		value: '',
		type: 'text',
		required: true,
		errorText: 'Первая буква должна быть заглавной, без пробелов, цифр и спецсимволов, кроме дефиса',
		validationType: 'name',
		classList: '',
	},
	{
		id: 'phone',
		name: 'phone',
		label: 'Телефон',
		value: '',
		type: 'text',
		required: true,
		errorText: 'Телефон должен содержать от 10 до 15 символов, состоит из цифр, может начинаться с плюса',
		validationType: 'phone',
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
	{
		id: 'repeatPassword',
		name: 'repeat_password',
		label: 'Повторите пароль',
		value: '',
		type: 'password',
		required: true,
		//errorText: 'Пароль должен содержать от 8 до 40 символов, обязательно хотя бы одну заглавную букву и цифру',
		//validationType: 'password',
		classList: '',
	},
];

export default class RegistrationPage extends React.Component {

	regButtons = [
		{
			id: 'registrationButton',
			name: 'Зарегистрироваться',
			classes: 'add-link',
			onClick: (event) => {
				event.preventDefault();
				this.submitRegForm(true, '/phones');
			},
		},
		{
			id: 'backButton',
			name: 'Назад',
			classes: 'reg-link',
			onClick: (event) => {
				event.preventDefault();
				this.setState({
		            redirect: true,
		        	linkToRedirect: '/',
		        });
			},
		},
	]

	constructor(props) {
        super(props);
        this.state = {...props};
        this.state.id = "regForm";
        this.state.title = 'Регистрация';
        this.state.infoData = '';
        this.state.redirect = false;
        this.state.linkToRedirect = '';
        this.state.loadingClass = '';      
    }

	submitRegForm(value, link){
		const $this = this;
		onSubmitForm('#regForm', function(data){
			console.log(data)
			const infoBlock = document.getElementById('regForm').querySelector('.info-block');
			const loadingBlock = document.getElementById('regForm').querySelector('.loading-form-block');

			loadingBlock.classList.add('loading-form-class');
			
			createRequest('/userRegistration', 'POST', JSON.stringify(data), function(request){
				loadingBlock.classList.remove('loading-form-class');
				if (request.response){
					if (request.response == "ok"){
						infoBlock.textContent = "";
						localStorage.setItem('login', data.login);
	        			$this.setState({
				            redirect: value,
				        	linkToRedirect: link,
				        });
	        		} else {
	        			infoBlock.textContent = request.response;
	        		}
				} else {
					if (request.error){
						infoBlock.textContent = request.error;
					} else {
						infoBlock.textContent = "Произошла ошибка";
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

    	document.title = "Регистрация";

    	const formInputsBlock = registrationFormInputs.map(input => {
    		let classList = "form-block " + input.classList;
	    	return <Input key={input.id} id={input.id} label={input.label} type={input.type} classList={classList}
	    	name={input.name} value={input.value} required={input.required} errorText={input.errorText} 
	    	validationType={input.validationType}
	    	 />;
	   	});

    	const formButtonsBlock = this.regButtons.map(button => {
    		let classList = "button-link " + button.classes;
	    	return <div key={button.id}><Button classes={classList} name={button.name} onClick={button.onClick} /></div>;
	   	});
	    return (
        	<div>
	        	{this.renderRedirect()}
	        	<Form id={this.state.id} loadingClass={this.state.loadingClass} title={this.state.title} infoData={this.state.infoData} inputs={formInputsBlock} buttons={formButtonsBlock} />
	        </div>
        )
    }
}