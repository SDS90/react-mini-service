const express = require("express");

const PORT = process.env.PORT || 3001;

const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();

let jsonParser = bodyParser.json(); 
app.use(bodyParser.urlencoded({extended: true}));

function parseJSON(JSONData){
    //исправление ошибки при чтении jsona
    let firstChar = JSONData.substring(0, 1);
    let firstCharCode = JSONData.charCodeAt(0);
    if (firstCharCode == 65279) {
        console.log('First character "' + firstChar + '" (character code: ' + firstCharCode + ') is invalid so removing it.');
        JSONData = JSONData.slice(1);
    }

    //Массив данных
    return JSON.parse(JSONData);
}

app.get("/api", function (request, response) {
	return response.json({ message: "Hello from Express!" });
});

//Получение полного списка
app.get("/getData", jsonParser, function (request, response) {
    fs.readFile("data/phonesData.json", "utf8", 
        function(error,data){     
            if (error) throw error; // если возникла ошибка
            return response.send(data);
        });
});

//Авторизация пользователя
app.post("/userAuthorization", jsonParser, function (request, response) {

    if(!request.body) return response.sendStatus(400);

    //Чтение актуального файла
    fs.readFile("data/usersData.json", "utf8", function(error,data){     
        if (error) throw error; // если возникла ошибка
        let requestBody = request.body;
        let usersArray = parseJSON(data);
        let userId = -1;
        for (let i = 0; i < usersArray.length; i++){
            if ((usersArray[i].login == requestBody.login) && (usersArray[i].password == requestBody.password)){
                userId = i;
                break;
            }
        }
        if (userId > -1){
            usersArray[userId].auth = true;
            fs.writeFile("data/usersData.json", JSON.stringify(usersArray), function(error){ 
                if(error) throw error; // если возникла ошибка
                console.log("Запись файла завершена.");
                return response.send("ok");
            });
        } else {
            return response.send('');
        }
    });
});

//Выход пользователя
app.post("/userLogout", jsonParser, function (request, response) {

    if(!request.body) return response.sendStatus(400);

    //Чтение актуального файла
    fs.readFile("data/usersData.json", "utf8", function(error,data){     
        if (error) throw error; // если возникла ошибка
        let requestBody = request.body;
        let usersArray = parseJSON(data);
        let userId = -1;
        for (let i = 0; i < usersArray.length; i++){
            if (usersArray[i].login == requestBody.login){
                userId = i;
                break;
            }
        }
        if (userId > -1){
            usersArray[userId].auth = false;
            fs.writeFile("data/usersData.json", JSON.stringify(usersArray), function(error){ 
                if(error) throw error; // если возникла ошибка
                console.log("Запись файла завершена.");
                return response.send("ok");
            });
        } else {
            return response.send('');
        }
    });
});

//Проверка авторизации пользователя
app.post("/checkUserLogout", jsonParser, function (request, response) {

    if(!request.body) return response.sendStatus(400);

    //Чтение актуального файла
    fs.readFile("data/usersData.json", "utf8", function(error,data){     
        //if (error) throw error; // если возникла ошибка
        let requestBody = request.body;
        let usersArray = parseJSON(data);
        let userId = -1;
        for (let i = 0; i < usersArray.length; i++){
            if ((usersArray[i].login == requestBody.login) && (usersArray[i].auth == true)){
                userId = i;
                break;
            }
        }
        return response.send(userId.toString());
    });
});

//Регистрация пользователя
app.post("/userRegistration", jsonParser, function (request, response) {

    if(!request.body) return response.sendStatus(400);

    //Чтение актуального файла
    fs.readFile("data/usersData.json", "utf8", 
        function(error,data){     
            if (error) throw error; // если возникла ошибка

            let requestBody = request.body;
            let usersArray = parseJSON(data);

            //Ищем, не зарегистрирован ли уже такой пользователь
            let userResult = usersArray.filter(function(val) {
              return (val.Login == requestBody.login) && (val.Password == requestBody.password);
            })[0];

            if (userResult){
                return response.send("Пользователь с таким логином уже зарегистрирован");
            } else {
                let newUser = {
                    id: usersArray.length + 1,
                    email: requestBody.email,
                    login: requestBody.login,
                    password: requestBody.password,
                    firstName: requestBody.first_name,
                    secondName: requestBody.second_name,
                    patronymic: requestBody.patronymic,
                    phone: requestBody.phone,
                };
                usersArray.push(newUser);
                fs.writeFile("data/usersData.json", JSON.stringify(usersArray), function(error){ 
                    if(error) throw error; // если возникла ошибка
                    console.log("Запись файла завершена.");
                    return response.send("ok");
                });
            }
        });
});

//Редактирование или добавление новой записи
app.post("/updateData", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    //Чтение актуального файла
	fs.readFile("data/phonesData.json", 'utf-8', function(readerror,usersData){ 
		if(readerror) throw readerror; // если возникла ошибка

        //исправление ошибки при чтении jsona
        var firstChar = usersData.substring(0, 1);
	    var firstCharCode = usersData.charCodeAt(0);
	    if (firstCharCode == 65279) {
	        console.log('First character "' + firstChar + '" (character code: ' + firstCharCode + ') is invalid so removing it.');
	        usersData = usersData.slice(1);
	    }

        //Массив данных
        let usersArray = JSON.parse(usersData);

        //Для валидации на бекенде должно быть false
        var isNotValid = false;

        //Проверка заполненности длины имени
        if (request.body.Name){
            isNotValid = !(request.body.Name.length<=100);
        } else {
            isNotValid = true;
        }

        //Проверка заполненности даты рождения
        if (!request.body.Day || !request.body.Mounth || !request.body.Year){
            isNotValid = true;
        }

        //Проверка невалидных дат (короткие месяцы и високосные годы)
        var isShortMonth = false, isFebruare = false, isLeapYear = false;
        if ((request.body.Mounth === "2") || (request.body.Mounth === "4") || (request.body.Mounth === "6") || (request.body.Mounth === "9") || (request.body.Mounth === "11")){
            isShortMonth = true;
        }
        if ((request.body.Mounth === "2")){
            isFebruare = true;
        }
        if ((request.body.Mounth === "2") && ( ((parseInt(request.body.Year, 10) % 4 === 0) && (parseInt(request.body.Year, 10) % 100 !== 0)) || (parseInt(request.body.Year, 10) % 400 === 0)))  {
            isLeapYear = true;
        }

        if ( ((request.body.Day === 31) && isShortMonth) || ((request.body.Day === 30) && isFebruare) || ((request.body.Day === 29) && isLeapYear) ){
            isNotValid = true;
        }

        //Проверка номера телефона
        if (!request.body.Phone){
            isNotValid = false;
        }
        isNotValid = !(/^\+7\d{10}$/.test(request.body.Phone));

        if (!isNotValid){

            //Если новый - присваиваем id и добавляем в конец массива
            if (!request.body.id){
                let newUser = {
                	id: usersArray.length + 1,
                	Name: request.body.Name,
                	birthday: {
                		Day: parseInt(request.body.Day),
                		Mounth: parseInt(request.body.Mounth),
                		Year: parseInt(request.body.Year)
                	},
                	City: request.body.City,
                	Address: request.body.Address,
                	Phone: request.body.Phone
                };
                usersArray.push(newUser);
            } else {
                //Если редактируем существующий - ищем по id запись и обновляем
            	usersArray.forEach(function(item, i, arr) {
                	if (item.id == request.body.id){
    	            	item.Name = request.body.Name;
    	            	item.birthday = {
    	            		Day: parseInt(request.body.Day),
    	            		Mounth: parseInt(request.body.Mounth),
    	            		Year: parseInt(request.body.Year)
    	            	};
    	            	item.City = request.body.City;
    	            	item.Address = request.body.Address;
    	            	item.Phone = request.body.Phone;
                	}
    			});
            }

            //Записываем новый файл
    		fs.writeFile("data/phonesData.json", JSON.stringify(usersArray), function(error){ 
    	        if(error) throw error; // если возникла ошибка
    	        console.log("Запись файла завершена.");
                return response.send("ok");
    		});            
        } else {
            //Если невалидно - ошибка
            return response.send("notvalid");
        }
	});

    
});

//Удаление записи по id
app.post("/deleteData", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    //Чтение актуального файла
	fs.readFile("data/phonesData.json", 'utf-8', function(readerror,usersData){ 
		if(readerror) throw readerror; // если возникла ошибка

        //исправление ошибки при чтении jsona
        var firstChar = usersData.substring(0, 1);
	    var firstCharCode = usersData.charCodeAt(0);
	    if (firstCharCode == 65279) {
	        console.log('First character "' + firstChar + '" (character code: ' + firstCharCode + ') is invalid so removing it.');
	        usersData = usersData.slice(1);
	    }

        let usersArray = JSON.parse(usersData), newUsersArray = [];

        //В новый массив запись не попадёт - на всякий случай перебором
        if (request.body.id){
            var count = 1;
            usersArray.forEach(function(item, i, arr) {
            	var newItem = {};
            	if (item.id != request.body.id){
            		item.id = count;
                    count++;
            		newUsersArray.push(item);
            	}            	
			});			
        } else {
            //Если удалять нечего
        	newUsersArray = usersArray;
        }

        //Записываем новый файл
		fs.writeFile("data/phonesData.json", JSON.stringify(newUsersArray), function(error){ 
	        if(error) throw error; // если возникла ошибка
	        console.log("File updated.");
            return response.send("ok");
		});        
	});    
});

//Получение данных записи по id
app.post("/getUser", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    //Чтение актуального файла
    fs.readFile("data/phonesData.json", 'utf-8', function(readerror,usersData){ 
        if(readerror) throw readerror; // если возникла ошибка

        //исправление ошибки при чтении jsona
        var firstChar = usersData.substring(0, 1);
        var firstCharCode = usersData.charCodeAt(0);
        if (firstCharCode == 65279) {
            console.log('First character "' + firstChar + '" (character code: ' + firstCharCode + ') is invalid so removing it.');
            usersData = usersData.slice(1);
        }

        let usersArray = JSON.parse(usersData), userItem = {};

        //Ищем запись
        if (request.body.id){
            usersArray.forEach(function(item, i, arr) {
                if (item.id == request.body.id){
                    userItem = item;
                }               
            });         
        } else {
            //Если id не задан
            return response.send("noId");
        }

        if (!userItem.id){
            //Если нет пользователя с таким id
            return response.send("noUser");
        } else {
            //Если всё ок
            return response.send(JSON.stringify(userItem))
        }
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});