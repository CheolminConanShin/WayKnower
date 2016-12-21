function getCurrentPosition() {
	console.log(navigator.geolocation);
	navigator.geolocation.getCurrentPosition(geolocation_callback);
}

let geolocation_callback = function(position) {
	postMessage(position.coords);
	getCurrentPosition();
}

getCurrentPosition();