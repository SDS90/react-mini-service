//Подключаемые модули
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InputMask from 'react-input-mask';
import {createRequest} from "./utilities/transfer";
import { Navigate, useNavigate   } from 'react-router-dom'
import './sass/init.scss';

//import Form, { FormParams, onSubmitForm } from './elements/form-block';
import AuthorizationPage from './pages/authorization';
import RegistrationPage from './pages/registration';
      
//Компонент списка пользователей
class ItemsList extends React.Component {

    //Конструктор
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            values: [],
            logout: false,
            showConfirmationDelete: "none",
            showErrorDelete: "block",
            deleteId: null,
            deleteMessage: "",
        };            
    }

    //Для запроса списка пользователей
    componentDidMount() {
        const $this = this;

        //Вытаскиваем данные из файла    
        var request = new XMLHttpRequest();
        request.open('GET','/getData',true);
        request.send();
        request.addEventListener('readystatechange', function() {
            //Если всё ок
            if ((request.readyState === 4) && (request.status === 200)) {
                //Если список пуст или не загрузился
                if (!request.response || !JSON.parse(request.response).length){
                    $this.setState({
                        error: "",
                        isLoaded: true,
                        values: []
                    });
                } else {
                    //Если всё ок
                    $this.setState({
                        error: "",
                        isLoaded: true,
                        values: JSON.parse(request.response)
                    });
                }
            } else {
                //Если ошибка
                $this.setState({
                  values: {},
                  isLoaded: true,
                  error: request.statusText
                });
            }
        });            
    }

    //Обработка клика на удаление записи из списка
    onDeleteClick(id,e) {
        e.preventDefault();
        //Показываем окно подтверждения
        this.setState({
            showConfirmationDelete: "block",
            deleteMessage: "Вы действительно хотите удалить эту запись?",
            deleteId: id
        });
    }

    //Удаление записи по id
    onDeleteUser(confirm,e) {
        e.preventDefault();
        const $this = this;

        //Подтверждение удаления
        if (confirm === "yes"){
            //Отправка запроса на удаление
            var request = new XMLHttpRequest();
            request.open('POST','/deleteData', true);          
            request.setRequestHeader("Content-type", "application/json; charset=utf-8");
            request.send(JSON.stringify({'id':this.state.deleteId}));
            request.addEventListener('readystatechange', function() {           
                if ( (request.readyState === 4) && request.status === 200){
                    //Если всё ок - скрываем окно и очищаем переменную удаления
                    $this.setState({
                        showConfirmationDelete: "none",
                        showErrorDelete: "block",
                        deleteId: null
                    });
                    $this.componentDidMount();
                } else {
                    //Вывод сообщения об ошибке
                    $this.setState({
                        showConfirmationDelete: "block",
                        showErrorDelete: "none",
                        deleteMessage: "Не удалось удалить запись. Ошибка: " + request.responseText
                    });
                }
            }); 
        } else {
            //Скрываем окно и оставляем всё как есть
            this.setState({
                showConfirmationDelete: "none",
                showErrorDelete: "block",
                deleteId: null
            });
            return false;
        }
    }

    logOut(){
    	let $this =  this;
    	createRequest('/userLogout', 'POST', JSON.stringify({login: localStorage.getItem('login')}), function(request){
			if (request.response){
				localStorage.removeItem('login');
    			$this.setState({
		            logout: true
		        });
			}
		});
    }
      
    //Загрузка страницы списка
    render() {
    	if (this.state.logout){
    		return <Navigate to = '/' />
    	}

        const $this = this; 
        document.title = "Телефонный справочник";        

        if (this.state.error) {
            //Ошибка загрузки
            return <div>Ошибка загрузки страницы: {this.state.error}</div>;
        } else if (!this.state.isLoaded) {
            //Загрузка...
            return <div className="loading-overlay"></div>;
        } else if (this.state.values.length) {
            //Если всё ок        
            return (
                <div className="phonebook-wrapper">         
                    <h2>Телефонный справочник</h2>

                    <a href="#" className="logout-link" onClick={(e) => {$this.logOut()}}>Выход</a>
                  
                    <table className="phonebook-table">
                        <thead>
                            <tr>
                                <th className="cell-id">№</th>
                                <th>ФИО</th>
                                <th>Дата рождения</th>
                                <th>Город</th>
                                <th>Адрес</th>
                                <th>Телефон</th>
                                <th className="no-border-cell"></th>
                                <th className="no-border-cell"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.values.map(function(item, index){
                                    //Тут добавляем названия месяцев в зависимости от числа
                                    var birthdayName = "";
                                    switch (item.birthday.Mounth) {
                                        case 1: {
                                            birthdayName = item.birthday.Day + " января " + item.birthday.Year;
                                            break;
                                        }
                                        case 2: {
                                            birthdayName = item.birthday.Day + " февраля " + item.birthday.Year;
                                            break;
                                        }
                                        case 3: {
                                            birthdayName = item.birthday.Day + " марта " + item.birthday.Year;
                                            break;
                                        }
                                        case 4: {
                                            birthdayName = item.birthday.Day + " апреля " + item.birthday.Year;
                                            break;
                                        }
                                        case 5: {
                                            birthdayName = item.birthday.Day + " мая " + item.birthday.Year;
                                            break;
                                        }
                                        case 6: {
                                            birthdayName = item.birthday.Day + " июня " + item.birthday.Year;
                                            break;
                                        }
                                        case 7: {
                                            birthdayName = item.birthday.Day + " июля " + item.birthday.Year;
                                            break;
                                        }
                                        case 8: {
                                            birthdayName = item.birthday.Day + " августа " + item.birthday.Year;
                                            break;
                                        }
                                        case 9: {
                                            birthdayName = item.birthday.Day + " сентября " + item.birthday.Year;
                                            break;
                                        }
                                        case 10: {
                                            birthdayName = item.birthday.Day + " октября " + item.birthday.Year;
                                            break;
                                        }
                                        case 11: {
                                            birthdayName = item.birthday.Day + " ноября " + item.birthday.Year;
                                            break;
                                        }
                                        case 12: {
                                            birthdayName = item.birthday.Day + " декабря " + item.birthday.Year;
                                            break;
                                        }
                                        default: break;
                                    }
                                    //Строка в таблице. data-label - для адаптивизации
                                    return (
                                        <tr key={index}>
                                            <td data-label ="№" className="cell-id">{item.id}</td>
                                            <td data-label ="ФИО" >{item.Name}</td>
                                            <td data-label ="Дата рождения" >{birthdayName}</td>
                                            <td data-label ="Город" >{item.City}</td>
                                            <td data-label ="Адрес" >{item.Address}</td>
                                            <td data-label ="Телефон" ><a title="Позвонить" href={"tel:" + item.Phone}>{item.Phone}</a></td>
                                            <td className="center-cell action-cell clear">
                                                <Link className="action-link edit" title="Редактировать"  to={`/edit/${item.id}`}></Link>
                                                <a tabIndex="0"  title="Удалить" className="action-link delete mobile-only" onClick={(e) => {$this.onDeleteClick(item.id, e)}}></a>
                                            </td>
                                            <td className="center-cell action-cell desktop-only">
                                                <a tabIndex="0"  title="Удалить" className="action-link delete" onClick={(e) => {$this.onDeleteClick(item.id, e)}}></a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {/*Добавление нового номера - кнопка*/}
                            <tr>
                                <td className="cell-id no-border-cell desktop-only"></td>
                                <td className="no-border-cell" colSpan="7"><Link className="add-link" to={`/add`}>Добавить новый контакт</Link></td>
                            </tr>
                        </tbody>
                    </table> 

                    {/*А тут сделаем попап подтверждения удаления*/}
                    <div className="popup-overlay"  style={{display: this.state.showConfirmationDelete}}  onClick={(e) => {$this.onDeleteUser("no", e)}}>
                        <div className="popup-container">
                            <div className="popup-window">
                                <p>{this.state.deleteMessage}</p>
                                <div className="buttons-wrapper" style={{display: this.state.showErrorDelete}}>
                                    <a tabIndex="0" className="button-link" onClick={(e) => {$this.onDeleteUser("yes", e)}}>Да</a>
                                    <a tabIndex="0" className="button-link" onClick={(e) => {$this.onDeleteUser("no", e)}}>Нет</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            //Если ничего нет
            return (
                <div className="phonebook-wrapper">         
                    <h2>Телефонный справочник</h2>
                    <div>Данных не найдено.</div>
                </div>
            )
        }                  
    }
}
  
//Компонент страницы 404
class NotFound extends React.Component{
    render(){
        return (
            <ErrorPageComponent header="Страница не найдена" />
        )
    }
}
  
//Компонент страницы редактирования/добавления
class EditComponent extends React.Component{

    //Конструктор
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            values: {},
            noUser: false,
            noId: false,
            newUser: false,
        };
    }

    //Для запроса данных
    componentDidMount() {
        const pathArray = window.location.pathname.split("/");
        const $this = this;

        //Если открыта страница добавления - просто открываем и никаких запросов
        if (pathArray[1] === "add"){
            $this.setState({
                error: "",
                isLoaded: true,
                newUser: true,
            });
            return false;
        } 

        //Запрос данных пользователя по id - если открыта страница редактирования конкретного пользователя
        var dataString = JSON.stringify({'id': pathArray[pathArray.length - 1]});

        var request = new XMLHttpRequest();
        request.open('POST','/getUser', true);          
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");
        request.send(dataString);
        request.addEventListener('readystatechange', function() {
            //Если всё ок с ответом           
            if ( (request.readyState === 4) && request.status === 200){
                //id не задан
                if (request.response === "noId"){
                    $this.setState({
                        error: "",
                        isLoaded: true,
                        noId: true,
                    });
                } else {
                    //Пользователя с таким id не существует
                    if (request.response === "noUser"){
                        $this.setState({
                            error: "",
                            isLoaded: true,
                            noUser: true,
                        });
                    } else {
                        //Если данные есть - парсим их и идём дальше
                        $this.setState({
                            error: "",
                            isLoaded: true,
                            values: JSON.parse(request.response)
                        });
                    }    
                }              
            } else {
                //Ошибка
                $this.setState({
                    error: request.statusText,
                    isLoaded: true,
                });
            }
        });
    }

      //Рендер страницы редактирования/добавления
    render(){
        if (this.state.error) {
            //Ошибка
            var errorText = "Error:" +this.state.error;
            return (                  
                <ErrorPageComponent formname={errorText} />
            )
        } else if (!this.state.isLoaded) {
            //Загрузка
            return <div className="loading-overlay"></div>;
        } else if (this.state.noUser) {
            return (
                <ErrorPageComponent formname="Пользователя с таким id не существует" />
            )
        } else if (this.state.noId) {
            return (
                <ErrorPageComponent formname="Id пользователя не задан" />
            )
        } else if (this.state.values.id){
            return (
                <div>
                    <ContactForm formname="Редактировать существующую запись"  phone={this.state.values} />
                </div>
            )
        } else {
            if (this.state.newUser){
                return (
                    <div>
                        <ContactForm formname="Добавить новую запись" />
                    </div>
                )
            } else {
                return (
                    <ErrorPageComponent formname="Ошибка запроса данных" />
                )
            }
        }
    }
}

//Компонент вывода ошибки (любой)
class ErrorPageComponent extends React.Component {
    render(){
        var headerText = this.props.header
        if (!headerText) {
            headerText = "Ошибка загрузки страницы"
        }
        return (
            <div className="phonebook-wrapper">
                <h2>{headerText}</h2>
                <div className="buttons-wrapper">
                    <Link className="button-link" to={"/"}>На главную</Link>
                </div>
            </div>
        )
    }
}

//Компонент формы редактирования/добавления
class ContactForm extends React.Component {

    //Конструктор
    constructor (props) {
        super(props);

        //Установка начальных данных
        this.state = {};
        this.state.isAfterSubmitName = false;   
        this.state.isAfterSubmitBirthday = "";
        this.state.isAfterSubmitPhone = "";
        this.state.redirect = false
        this.state.errorText = "";
        this.state.isSend = "none";
        this.state.isError = "none";
        this.state.phoneColor = "";

        //Если редактируем - берём данные из запроса
        if (props.phone){
            this.state.nameValid = this.validateName(props.phone.Name);
            this.state.Id = props.phone.id;
            this.state.Name =  props.phone.Name; 
            this.state.City = props.phone.City;
            this.state.Day = props.phone.birthday.Day;
            this.state.Mounth = props.phone.birthday.Mounth;
            this.state.Year = props.phone.birthday.Year;
            this.state.Address = props.phone.Address;
            this.state.Phone = props.phone.Phone;          
        } else {
            //В остальных случаях - берём из localStorage
            this.state.nameValid = this.validateName(localStorage.getItem('PhoneBookAddName'));
            this.state.Name =  localStorage.getItem('PhoneBookAddName'); 
            this.state.City = localStorage.getItem('PhoneBookAddCity');
            this.state.Day = localStorage.getItem('PhoneBookAddDay');
            this.state.Mounth = localStorage.getItem('PhoneBookAddMounth');
            this.state.Year = localStorage.getItem('PhoneBookAddYear');
            this.state.Address = localStorage.getItem('PhoneBookAddAddress');
            this.state.Phone = localStorage.getItem('PhoneBookAddPhone');
        }
    }        

    //Перенаправление на главную после отправки формы
    setRedirect(){
        this.setState({
            redirect: true
        });
    }

    renderRedirect(){
        if (this.state.redirect) {
            return <Navigate to='/phones' />
        }
    }

    //Изменение поля
    onChangeInput(value,fieldname){
        var setDataObject = {};
        setDataObject[fieldname] = value;
        setDataObject["isAfterSubmit" + fieldname] = "";
        this.setState(setDataObject);

        //Записываем в localStorage
        if (!this.props.phone){
            localStorage.setItem("PhoneBookAdd" + fieldname, value);
        } 

        //Валидация длины имени
        if (fieldname === "Name"){
            if (value.length > 100){
                value = value.substr(0,100);
            }
            var valid = this.validateName(value);
            this.setState({
                nameValid: valid
            }); 
        }
    }

    //Валидация длины имени
    validateName(value){
        if (value){
            return value.length<=100;
        } else {
            return true;
        }
    }

    //Валидация заполненности имени
    validRequiredName(){
        return this.state.Name;
    }

    //Валидация заполненности даты рождения
    validRequiredBirthday(){
        if (!this.state.Day || !this.state.Mounth || !this.state.Year){
            return false;
        }
        return (this.state.Day && this.state.Mounth && this.state.Year);
    }

    //Валидация формата номера телефона
    validPhone(){
        if (!this.state.Phone){
            return true;
        }
        return /^\+7\d{10}$/.test(this.state.Phone);
    }

    //Отправка формы
    submitForm (e) {
        e.preventDefault();
        const $this = this;
        var isNotValid = false; //Должно быть false для успеха

        //Валидация имени на заполненность и длину
        if (!this.validRequiredName() || !this.validateName(this.state.Name)){
            this.setState({
                 isAfterSubmitName: "",
            });
            isNotValid = true;
        }
        //Валидации даты рождения на заполненность
        if (!this.validRequiredBirthday()){
            this.setState({
                isAfterSubmitBirthday: "Дата рождения обязательна для заполнения.",
            });
            isNotValid = true;
        }
        //Валидация маски через регулярку
        if (!this.validPhone()){
            this.setState({
                isAfterSubmitPhone: "Неверный формат ввода номера телефона.",
            });
            isNotValid = true;
        }

        //Если что-то не валидно - не отправляем ничего
        if (isNotValid){
            return false;
        }

        //Показыаем блок отправки
        this.setState({
            isSend: "block",
            isError: "none",
            errorText: ""
        });

        //Отправка данных
        var request = new XMLHttpRequest();
        request.open('POST','/updateData',true);          
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");
        request.send(JSON.stringify({"id":this.state.Id, "Name": this.state.Name,"City": this.state.City, "Day": this.state.Day, "Mounth": this.state.Mounth, "Year": this.state.Year, "Address": this.state.Address, "Phone": this.state.Phone}));
        request.addEventListener('readystatechange', function() {
            //Если всё ок
            if ( (request.readyState === 4) && request.status === 200){
                if (request.response === "notvalid"){
                    //Если не сработала валидация на сервере
                    $this.setState({
                        isSend: "none",
                        isError: "block",
                        errorText: "Возникла ошибка при валидации на сервере. Проверьте отправленные данные."
                    });
                } else {
                    //Если всё ок - закрываем страницу, идём на главную
                    $this.setState({
                      redirect: true,
                      isSend: "none",
                      isError: "none",
                      errorText: ""
                    });
                }
            } else {
                //Ошибка
                $this.setState({
                    isSend: "none",
                    isError: "block",
                    errorText: request.responseText
                });
            }
        });     
    }

    //Рендеринг формы
    render() {
        const $this = this;
        document.title = this.props.formname;

        // цвет границы для поля для ввода имени
        this.state.nameColor = "";
        var nameErrorBlockState = "none", nameErrorText = "";
        if ( (this.state.nameValid !== true) && (this.state.nameValid !== undefined) ) {
            this.state.nameColor = "error-input";
            nameErrorBlockState = "block";
            nameErrorText = "ФИО не может быть длиннее 100 символов.";
        }
        if (this.state.isAfterSubmitName){
            this.state.nameColor = "error-input";
            nameErrorBlockState = "block";
            nameErrorText = "Поле ФИО обязательно для заполнения.";
        }

        // цвет границы для поля для ввода даты рождения
        this.state.birthdayColor = "";
        var birthdayErrorBlockState = "none", birthdayErrorText = "";
        if (this.state.isAfterSubmitBirthday){
            this.state.birthdayColor = "error-input";
            birthdayErrorBlockState = "block";
            birthdayErrorText = this.state.isAfterSubmitBirthday;
        }

        // цвет границы для поля для ввода телефона
        this.state.phoneColor = "";
        var phoneErrorBlockState = "none", phoneErrorText = "";
        if (this.state.isAfterSubmitPhone){
            this.state.phoneColor = "error-input";
            phoneErrorBlockState = "block";
            phoneErrorText = this.state.isAfterSubmitPhone;
        }

        //Список месяцев и дней
        var MounthItems = ["","Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
        var DayItems = [null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var YearItems = [null,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018];

        //Короткие месяцы, високосные годы
        var isShortMonth = false, isFebruare = false, isLeapYear = false;                     
        
        if (($this.state.Mounth === "2") || ($this.state.Mounth === "4") || ($this.state.Mounth === "6") || ($this.state.Mounth === "9") || ($this.state.Mounth === "11")){
            isShortMonth = true;
        }
        if (($this.state.Mounth === "2")){
            isFebruare = true;
        }
        if (($this.state.Mounth === "2") && ( ((parseInt($this.state.Year, 10) % 4 === 0) && (parseInt($this.state.Year, 10) % 100 !== 0)) || (parseInt($this.state.Year, 10) % 400 === 0)))  {
            isLeapYear = true;
        }

        return (
            <div className="phonebook-wrapper form-wrapper">
                {/*Редирект, если нужен*/} 
                {this.renderRedirect()}

                {/*Заголовок формы*/}
                <h2>{this.props.formname}</h2>

                {/*Форма редактирования*/}
                <form onSubmit={this.submitForm.bind(this)}>

                    <fieldset>
                        {/*ФИО*/}
                        <div className="form-block">
                            <label>ФИО (обязательно, до 100 символов):</label>
                            <div className="input-wrapper">
                                <input className={"form-control " + this.state.nameColor}  type="text" value={this.state.Name} onChange={e => this.onChangeInput(e.target.value,"Name")}/>
                                {/*Сообщение об ошибке*/}
                                <div className="error-text-block" style={{display: nameErrorBlockState}}>{nameErrorText}</div> 
                            </div>
                        </div>

                        {/*Дата рождения*/}
                        <div className="form-block">
                            <label>Дата рождения (обязательно): </label>
                            <div className="input-wrapper select-wrapper clear">

                                {/*День*/}
                                <div className="select-block-wrapper day-select">
                                    <div className="select-block">
                                        <select value={this.state.Day} className = {"form-control " + this.state.birthdayColor} onChange={e => this.onChangeInput(e.target.value,"Day")}>
                                            {
                                                DayItems.map(function (dayitem,i) {
                                                    if (dayitem === null){
                                                        return <option key={i} value={i} disabled></option>;
                                                    } else {
                                                        if ( ((dayitem === 31) && isShortMonth) || ((dayitem === 30) && isFebruare) || ((dayitem === 29) && isLeapYear) ){
                                                            return <option key={i} value={i.toString()} disabled>{dayitem}</option>;
                                                        } else {
                                                            return <option key={i} value={i.toString()}>{dayitem}</option>;
                                                        }
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>

                                {/*Месяц*/}
                                <div className="select-block-wrapper mounth-select">
                                    <div className="select-block">
                                        <select value={this.state.Mounth} className = {"form-control " + this.state.birthdayColor} onChange={e => this.onChangeInput(e.target.value,"Mounth")}>
                                            {
                                                MounthItems.map(function (mounthitem,i) {
                                                    if (mounthitem === ""){
                                                        return <option key={i} value="0" disabled="disabled"></option>;
                                                    } else {
                                                        return <option key={i} value={i.toString()}>{mounthitem}</option>;
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>

                                {/*Год*/}
                                <div className="select-block-wrapper year-select">
                                    <div className="select-block">
                                        <select value={this.state.Year} className = {this.state.birthdayColor} onChange={e => this.onChangeInput(e.target.value,"Year")}>
                                            {
                                              YearItems.map(function (yearitem,i) {
                                                    if (yearitem === null){
                                                        return <option key={i} value="0" disabled></option>;
                                                    } else {
                                                        return <option key={i} value={yearitem.toString()}>{yearitem}</option>;
                                                    }
                                              })
                                            }
                                        </select>
                                    </div>
                                </div>
                                {/*Сообщение об ошибке*/}
                                <div className="error-text-block"  style={{display: birthdayErrorBlockState}}>{birthdayErrorText}</div> 
                            </div>
                        </div>

                        {/*Город*/}
                        <div className="form-block">
                            <label>Город:</label>
                            <div className="input-wrapper">
                                <input className="form-control" type="text" value={this.state.City} onChange={e => this.onChangeInput(e.target.value,"City")}/>
                            </div>
                        </div>

                        {/*Адрес*/}
                        <div className="form-block">
                            <label>Адрес:</label>
                            <div className="input-wrapper">
                                <input className="form-control" type="text" value={this.state.Address} onChange={e => this.onChangeInput(e.target.value,"Address")}/>
                            </div>
                        </div>

                        {/*Телефон*/}
                        <div className="form-block">
                            <label>Телефон в формате +79999999999:</label>
                            <div className="input-wrapper">
                                <InputMask mask="+79999999999" maskChar={null} className={"form-control " + this.state.phoneColor} type="text" id="PhoneBookPhone" value={this.state.Phone} onChange={e => this.onChangeInput(e.target.value,"Phone")}/>
                                {/*Сообщение об ошибке*/}
                                <div className="error-text-block" style={{display: phoneErrorBlockState}}>{phoneErrorText}</div> 
                            </div>
                        </div>

                    </fieldset>

                    {/*Кнопки*/}
                    <div className="form-block buttons-wrapper buttons-right">
                        <Link className="button-link desktop-only" to={"/phones"}>Назад</Link> {/*Десктоп*/}
                        <button className="button-link opposite" type="button" onClick={(e) => this.submitForm(e)}>Отправить</button>
                        <Link className="button-link mobile-only" to={"/phones"}>Назад</Link> {/*Мобильный*/}
                    </div>

                </form>

                {/* Маска загрузки и отправки */}
                <div className="loading-overlay" style={{display:this.state.isSend}}></div>
                
                {/* Сообщение об ошибке */}
                <div className="send-error-text" style={{display:this.state.isError}}>{this.state.errorText}</div>
            </div>
        )
    }
}

//Общий компонет
export default class App extends Component { 

	componentWillMount () {
	   	//Проверим авторизацию
	    let login = localStorage.getItem('login');
	    if (login){
	    	let $this =  this;
	    	createRequest('/checkUserLogout', 'POST', JSON.stringify({login: login}), function(request){
	    		//Если пользователь не авторизован - перенаправляем на главную
				if (request.response && (request.response == -1)){
					localStorage.removeItem('login');
	    			window.location.href = "/"
				}
			});
	    }

	}

    //Рендеринг всего
    render() {
        return (<Router>
            <Routes>
                <Route exact path="/" element={<AuthorizationPage title="Вход" infoData="" id="authorizationForm"/>}/> {/* Список контактов */}
                <Route exact path="/phones" element={<ItemsList/>}/>
                <Route path="/add" element={<EditComponent/>} /> {/* Добавление нового */}
                <Route path="/edit/:id" element={<EditComponent/>} /> {/* Редактирование контакта */}  
                <Route path="/registration" element={<RegistrationPage title="Регистрация" infoData="" id="regForm"/>} /> {/* Регистрация */}    
                <Route path="*" element={<NotFound/>} /> {/* 404 */}
            </Routes>
        </Router>)
    }
}
