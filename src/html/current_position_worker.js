function getCurrentPosition() {
	console.log("메리 크리스마스")
	if ("geolocation" in navigator) {
		console.log("월급날이다!");
		navigator.geolocation.getCurrentPosition(geolocation_callback, fail_callback);
	} else {
	  	setTimeout("getCurrentPosition()",5000);
	}
	
}

let geolocation_callback = function(position) {
	postMessage(position, "route_select.html");
	getCurrentPosition();
}

let fail_callback = function() {
	console.log("Unable to find current coordinates");
	getCurrentPosition();
}

getCurrentPosition();