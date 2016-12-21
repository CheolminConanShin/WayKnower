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
	var departure = getParameterByName('departure');
	var destination = getParameterByName('destination');
	document.querySelector('#departure').innerHTML = departure;
	document.querySelector('#destination').innerHTML = destination;

	departureLongitude = getParameterByName('depLng');
	departureLatitude = getParameterByName('depLat');
	destinationLongitude = getParameterByName('desLng');
	destinationLatitude = getParameterByName('desLat');
	directionsService = new olleh.maps.DirectionsService('frKMcOKXS*l9iO5g');
	var control = olleh.maps.control.Control;

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
		disableMultiTabZoom: false,
		zoomControlOptions: {
			position: control.TOP_RIGHT, 
			direction: control.VERTICAL,
			top: 130,
			right: 20,
			style: olleh.maps.control.ZoomControl.SMALL
		}
	});
	
	var marker;
	navigator.geolocation.watchPosition(function(position) {
		if(marker != undefined){
			marker.erase();
		}
		
		marker = new olleh.maps.overlay.Marker({
			position: new olleh.maps.LatLng(position.coords.latitude, position.coords.longitude),
			map: map,
			icon: {
				url: '../lib/images/my_location.png'
			}
		});
		marker.setFlat(true);
	});

	recommendedRoute();
}

var clearMap = function() {
	var polylines = document.querySelectorAll('#layer_container svg polyline');
	if(polylines.length > 0){
		polylines.forEach(function(polyline) {
			polyline.remove();
		});
	}
	map.getLayer("Vector")._vectors = [];
	map.setCenter(new olleh.maps.LatLng(departureLatitude, departureLongitude)); 
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

