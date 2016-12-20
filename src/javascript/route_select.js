var map, directionsService;
var priorityType;
var departureLongitude, departureLatitude, destinationLatitude, destinationLongitude;
var getParameterByName = function(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// 초기화 함수
var documentReady = function() {
	let departure = getParameterByName('departure');
	let destination = getParameterByName('destination');
	document.querySelector('#departure').innerHTML = departure;
	document.querySelector('#destination').innerHTML = destination;

	departureLongitude = getParameterByName('depLng');
	departureLatitude = getParameterByName('depLat');
	destinationLongitude = getParameterByName('desLng');
	destinationLatitude = getParameterByName('desLat');
	directionsService = new olleh.maps.DirectionsService('frKMcOKXS*l9iO5g');
    map = new olleh.maps.Map('map_div', {
        center : new olleh.maps.LatLng(departureLatitude, departureLongitude),
        zoom : 7,
        zoomControl: true,
        copyrightControl: false,
        mapTypeControl: false,
        measureControl: false,
        scaleControl: false,
        panControl: false,
        disablePinchZoom: false,
        disableMultiTabZoom: false
    });

    map.onEvent("pinch", function(event, payload, scale) { 
    	alert(scale);
    });

    recommendedRoute();
}

var clearMap = function() {
	let polylines = document.querySelectorAll('#layer_container svg polyline')
	for (var polyline of polylines) {
		polyline.remove();
	}
	map.getLayer("Vector")._vectors = [];
}

var recommendedRoute = function() {
	clearMap();
	directionsService.route({
		origin : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(departureLatitude, departureLongitude)),
		destination : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(destinationLatitude, destinationLongitude)),
		projection : olleh.maps.DirectionsProjection.UTM_K, 
		travelMode : olleh.maps.DirectionsTravelMode.DRIVING,
		priority : olleh.maps.DirectionsDrivePriority.PRIORITY_0
	}, 
	getCallbackString(olleh.maps.DirectionsDrivePriority.PRIORITY_0)
	); 
}	
var shortestRoute = function() {
	clearMap();
	directionsService.route({
		origin : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(departureLatitude, departureLongitude)),
		destination : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(destinationLatitude, destinationLongitude)),
		projection : olleh.maps.DirectionsProjection.UTM_K, 
		travelMode : olleh.maps.DirectionsTravelMode.DRIVING,
		priority : olleh.maps.DirectionsDrivePriority.PRIORITY_1
	}, 
	getCallbackString(olleh.maps.DirectionsDrivePriority.PRIORITY_1)
	); 
}
var freeRoute = function() {
	clearMap();
	directionsService.route({
		origin : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(departureLatitude, departureLongitude)),
		destination : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(destinationLatitude, destinationLongitude)),
		projection : olleh.maps.DirectionsProjection.UTM_K, 
		travelMode : olleh.maps.DirectionsTravelMode.DRIVING,
		priority : olleh.maps.DirectionsDrivePriority.PRIORITY_2
	}, 
	getCallbackString(olleh.maps.DirectionsDrivePriority.PRIORITY_2)
	); 
}