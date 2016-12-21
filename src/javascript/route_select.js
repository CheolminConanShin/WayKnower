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
	var backButton = document.querySelector(".arrow-back");
	backButton.addEventListener("click", function(e) {
		location.replace("/");
	});

	var departure = getParameterByName('departure');
	var destination = getParameterByName('destination');
	document.querySelector('#departure').innerHTML = departure.substring(4);
	document.querySelector('#destination').innerHTML = destination.substring(4);

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

	drawRoutes();
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

var drawRoutes = function() {
	directionsService.route({
		origin : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(departureLatitude, departureLongitude)),
		destination : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(destinationLatitude, destinationLongitude)),
		projection : olleh.maps.DirectionsProjection.UTM_K, 
		travelMode : olleh.maps.DirectionsTravelMode.DRIVING,
		priority : olleh.maps.DirectionsDrivePriority.PRIORITY_3
	}, 
	getCallbackString(olleh.maps.DirectionsDrivePriority.PRIORITY_3)
	); 

	directionsService.route({
		origin : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(departureLatitude, departureLongitude)),
		destination : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(destinationLatitude, destinationLongitude)),
		projection : olleh.maps.DirectionsProjection.UTM_K, 
		travelMode : olleh.maps.DirectionsTravelMode.DRIVING,
		priority : olleh.maps.DirectionsDrivePriority.PRIORITY_0
	}, 
	getCallbackString(olleh.maps.DirectionsDrivePriority.PRIORITY_0)
	); 

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

var recommendedRoute = function() {
	setRouteDirectionDetails(recommended_direction_result);
	colorSelectedRoute("Recommended");
}	
var shortestRoute = function() {
	setRouteDirectionDetails(shortest_direction_result);
	colorSelectedRoute("Shortest");
}

var freeRoute = function() {
	setRouteDirectionDetails(freeway_direction_result);
	colorSelectedRoute("Freeway");
}

var colorSelectedRoute = function(routeName) {
	var polylines = document.querySelectorAll('#layer_container svg polyline');
	if(polylines.length > 0){
		var polylineGroup = polylines[0].parentNode;
		var removedPolyline;

		var vectors = map.getLayer("Vector")._vectors;
		if(vectors.length > 0) {
			vectors.forEach(function(polyline) {
				if(polyline._eventDom.id == routeName){
					polyline._opts.strokeColor = SELECTED_ROUTE_COLOR;
				}else{
					polyline._opts.strokeColor = UNSELECTED_ROUTE_COLOR;
				}
			});
		}

		polylines.forEach(function(polyline) {
			if(polyline.getAttribute("id") == routeName) {
				polyline.setAttribute("stroke", SELECTED_ROUTE_COLOR);
				removedPolyline = polylineGroup.removeChild(polyline);
			} else {
				polyline.setAttribute("stroke", UNSELECTED_ROUTE_COLOR);
			};
		});

		polylineGroup.appendChild(removedPolyline);
	}
}
