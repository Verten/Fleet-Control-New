let xhr = {

	loadData(path) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.overrideMimeType('application/json');
			xhr.open('GET', path, true);
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.onload = () => {
				// iOS needs returns 0 as status
				// http://simonmacdonald.blogspot.se/2011/12/on-third-day-of-phonegapping-getting.html
				if (xhr.status === 200 || xhr.status === 0) {
					resolve(xhr.responseText);
				} else {
					reject(Error(xhr.statusText));
				}
			}
			xhr.send(null);
		});
	},
	postData(path,jsonData){
		return new Promise(function(resolve, reject){
			var xhr = new XMLHttpRequest();
			xhr.overrideMimeType('application/json');
			xhr.open('POST', path, true);
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
			xhr.onload = () => {
				// iOS needs returns 0 as status
				// http://simonmacdonald.blogspot.se/2011/12/on-third-day-of-phonegapping-getting.html
				if (xhr.status === 200 || xhr.status === 0) {
					resolve(xhr.responseText);
				} else {
					reject(Error(xhr.statusText));
				}
			}
			xhr.send(jsonData);
		});
	}
}

export default xhr;
