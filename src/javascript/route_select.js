var map, directionsService;
var priorityType;
var departureLongitude, departureLatitude, destinationLatitude, destinationLongitude;
var boundList = [];
var dbKey;
var marker;

const backButton = document.querySelector(".arrow-back");
const goThisWayButton = document.querySelector(".go-this-way-button");
const shareButton = document.querySelector(".share-button");
const modalDialog = $(".modal");

// 초기화 함수
backButton.addEventListener("click", function(e) {
	location.replace("/");
});

goThisWayButton.addEventListener("click", function(e) {
	var disappearComponents = document.querySelectorAll(".go-away");
	disappearComponents.forEach(function(component) {
		component.className += " disappear";
	});
	shareButton.className = shareButton.className.replace(" disappear", "");

	if(getParameterByName("key") == null){
		setGeolocation();
	}

	connectDatabase();
	dbKey = generateDatabaseKey();
	receiveCoordinatesByKey(dbKey);
});

function activateKakao(){
	Kakao.init('3b1c9bd1870f46083d79ba8115f7f304');
	// 카카오톡 링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
	Kakao.Link.createTalkLinkButton({
		container: '#kakao-link-btn',
		label: '지인의 위치를 확인해주세요!',
		image: {
			src: '../lib/images/my_location.png',
			width: '300',
			height: '200'
		},
		webButton: {
			text: '확인하러가기',
			url: window.location.href + '&key=' + dbKey
		}
	});
};

var departure = getParameterByName('departure');
var destination = getParameterByName('destination');
document.querySelector('#departure').innerHTML = (departure.indexOf("대한민국") != -1 ? departure.substring(4) : departure);
document.querySelector('#destination').innerHTML = (destination.indexOf("대한민국") != -1 ? destination.substring(4) : destination);

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

recommendedRoute();

modalDialog.modal();

if(getParameterByName("key") != null) {
	dbKey = getParameterByName("key");
	goThisWayButton.click();
}

function getParameterByName(name, url) {
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

function clearMap() {
	var polylines = document.querySelectorAll('#layer_container svg polyline');
	if(polylines.length > 0){
		polylines.forEach(function(polyline) {
			polyline.remove();
		});
	}
	map.getLayer("Vector")._vectors = [];
	map.setCenter(new olleh.maps.LatLng(departureLatitude, departureLongitude)); 
}

function recommendedRoute() {
	clearMap();
	directionsService.route({
		origin : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(departureLatitude, departureLongitude)),
		destination : new olleh.maps.UTMK.valueOf(new olleh.maps.LatLng(destinationLatitude, destinationLongitude)),
		projection : olleh.maps.DirectionsProjection.UTM_K, 
		travelMode : olleh.maps.DirectionsTravelMode.DRIVING,
		priority : olleh.maps.DirectionsDrivePriority.PRIORITY_3
	}, 
	getCallbackString(olleh.maps.DirectionsDrivePriority.PRIORITY_3)
	); 
}	

function shortestRoute() {
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

function freeRoute() {
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

function getBoundsArray(routeList) {
	var routesArray = routeList.result.routes;
	var boundsArray = [];

	for(var cnt=0; cnt < routesArray.length-1; cnt++) {
		var fitstPointX = routesArray[cnt].point.x;
		var fitstPointY = routesArray[cnt].point.y;
		var secondPointX = routesArray[cnt+1].point.x;
		var secondPointY = routesArray[cnt+1].point.y;
		var lessX, moreX, lessY, moreY;

		if(fitstPointX <= secondPointX) {
			lessX = fitstPointX;
			moreX = secondPointX;
		} else {
			lessX = secondPointX;
			moreX = fitstPointX;
		}

		if(fitstPointY <= secondPointY) {
			lessY = fitstPointY;
			moreY = secondPointY;
		} else {
			lessY = secondPointY;
			moreY = fitstPointY;
		}
		var leftBottom = new olleh.maps.UTMK(lessX, lessY);
		var rightTop = new olleh.maps.UTMK(moreX, moreY);
		boundsArray.push(new olleh.maps.Bounds(leftBottom, rightTop));
	}
	return boundsArray;
}

function departureToDestinationMarker() {
	var departureIcon = {
			url: '../lib/images/start.png',
			size: new olleh.maps.Size(50, 50),
			anchor: new olleh.maps.Point(27, 22)
		};
	
	var departureUTMK_x = recommended_direction_result.result.links[0].x;
	var departureUTMK_y = recommended_direction_result.result.links[0].y;
	var departureMarker = new olleh.maps.overlay.Marker({
			position: new olleh.maps.UTMK(departureUTMK_x, departureUTMK_y),
			map: map,
			icon: {
				url: '../lib/images/start.png'
			}
		});
	departureMarker.setFlat(true);
    departureMarker.setIcon(departureIcon);

	var destinationIcon = {
			url: '../lib/images/pin.png',
			size: new olleh.maps.Size(50, 50),
			anchor: new olleh.maps.Point(27, 22)
		};

	var lastIndexOfArray = recommended_direction_result.result.links.length-1;
	var destinationUTMK_x = recommended_direction_result.result.links[lastIndexOfArray].x;
	var destinationUTMK_y = recommended_direction_result.result.links[lastIndexOfArray].y;
	var destinationMarker = new olleh.maps.overlay.Marker({
			position: new olleh.maps.UTMK(destinationUTMK_x, destinationUTMK_y),
			map: map,
			icon: {
				url: '../lib/images/pin.png'
			}
		});
	destinationMarker.setFlat(true);
	destinationMarker.setIcon(destinationIcon);
}

function setGeolocation() {
	var options = {
		enableHighAccuracy: false,
		timeout: 3000,
		maximumAge: 0
	};

	navigator.geolocation.watchPosition(function(position) {

		var currentPosition = new olleh.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var boundCheckFlag = false;
		boundList.forEach(function(bound) {
			if(bound.almostEquals(new olleh.maps.Bounds(olleh.maps.UTMK.valueOf(currentPosition), olleh.maps.UTMK.valueOf(currentPosition)), 500)) {
				boundCheckFlag = true;
			}
		});

		updateCoordinatesByKey(position.coords.latitude, position.coords.longitude, dbKey);

		if(!boundCheckFlag) {
			modalDialog.modal('open');
			window.navigator.vibrate(1000);
		}else{
			console.log("잘가고 있구만!");
		}
	}, null, options);
}

function receiveCoordinatesByKey(key){
	let firebaseRef = firebaseDB.ref(key);

	firebaseRef.on('value', function(snapshot) {
		if(snapshot.val() == null){
			return;
		}

		if(marker != undefined){
			marker.erase();
		}
		const coordinates = snapshot.val();
		var position = new olleh.maps.LatLng(coordinates.latitude, coordinates.longitude);
		marker = new olleh.maps.overlay.Marker({
			position: position,
			map: map,
			icon: {
				url: '../lib/images/my_location.png'
			}
		});
		marker.setFlat(true);
	});
}