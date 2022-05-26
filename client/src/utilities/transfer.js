//Transfer

export function createRequest(url, method, data, callback){	
	const request = new XMLHttpRequest();
	request.open(method,url, true);          
	request.setRequestHeader("Content-type", "application/json; charset=utf-8");
	request.send(data);
	request.addEventListener('readystatechange', function() {
		if ( (request.readyState === 4) && request.status === 200){
			if (callback){
				callback({response: request.response});
			}
		} else {
			if (callback){
				callback({error: request.statusText});
			}
		}
	});
}
