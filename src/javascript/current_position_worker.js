function getCurrentPosition() {
	navigator.geolocation.getCurrentPosition(geolocation_callback, fail_callback);
}

let geolocation_callback = function(position) {
	postMessage(position.coords);
	getCurrentPosition();
}

let fail_callback = function() {
	console.log("Unable to find current coordinates");
	getCurrentPosition();
}

getCurrentPosition();