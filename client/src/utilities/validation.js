//Валидация

const defaultValidationErrorMessage = "Возникла ошибка при заполнении формы. Пожалуйста, проверьте введённые данные.";
const repeatPasswordErrorMessage = "Пароли не совпадают.";
const requiredFieldsErrorMessage = "Не все обязательные поля заполнены.";
const requiredFieldMessage = "Обязательное поле.";

const validationRegex = {
	email: new RegExp(/^([A-Za-z0-9_\.-]+)@([A-Za-z0-9_\.-]+)\.([a-z\.]{2,6})$/),
	login: new RegExp(/^[A-Za-z0-9_\.-]{3,20}$/),
	name: new RegExp(/^[A-ZА-Я][a-zA-Zа-яА-Я-]+$/),
	phone: new RegExp(/^\+?\d{10,15}$/),
	password: new RegExp(/^((?=.*?[A-Z])(?=.*?[0-9])\S{8,40})\S$/),
};

export const validValue = function(input) {
	const validationType = input.getAttribute("data-validation-type");
	const errorText = input.getAttribute("data-error-text");

	const value = input.value;
	const regex = validationRegex[validationType];

	const inputWrapper = input.parentElement;
	const errorBlock = inputWrapper.querySelector(".error-text-block");
	if (regex && !regex.test(value)) {
		inputWrapper.classList.add('error-input');
		if (errorBlock){
			if (errorText){
				errorBlock.textContent = errorText;
			} else {
				errorBlock.textContent = defaultValidationErrorMessage;
			}
		}		
		return false;
	}
	inputWrapper.classList.remove('error-input');
	if (errorBlock){
		errorBlock.textContent = "";
	}

	return true;
};

export const validForm = function(form) {
	const formBlocks = form.querySelectorAll('.form-block');
	const infoBlock = form.querySelector(".info-block");

	let isFormValid = true;
	let password = "", repeatPassword = "";

	if (infoBlock){
		infoBlock.textContent = "";
	}

	formBlocks.forEach(function(formBlock) {
		const input = formBlock.querySelector("input") || formBlock.querySelector("textarea");
		if (input){
			const errorText = input.getAttribute("data-error-text");

			if (!formBlock.classList.contains("none-block") && !validValue(input)) {
				isFormValid = false;
			}
			if (!input.value && input.getAttribute("data-required") && !formBlock.classList.contains("none-block")){
				isFormValid = false;

				const errorWrapper = input.parentElement;
				if (errorWrapper) {
					errorWrapper.classList.add("error-input");

					if (errorText){
						errorWrapper.querySelector(".error-text-block").textContent = errorText;
					} else {
						errorWrapper.querySelector(".error-text-block").textContent = requiredFieldMessage;
					}
				}

				if (infoBlock){
					infoBlock.textContent = requiredFieldsErrorMessage;
				}
			}
			if (input.name == "password"){
				password = input.value;
			}
			if (input.name == "repeat_password"){
				repeatPassword = input.value;
			}
		}
	});
	
	if (password && repeatPassword && (password != repeatPassword)){
		isFormValid = false;
		infoBlock.textContent = repeatPasswordErrorMessage;
	}
	return isFormValid;
};