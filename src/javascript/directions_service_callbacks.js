const SHORTEST_PATH_COLOR = "#01afaf";
const RECOMMENDED_PATH_COLOR = "#01afaf";
const FREEWAY_PATH_COLOR = "#01afaf";
const TRAFFIC_PATH_COLOR = "purple";

const SELECTED_ROUTE_COLOR = "#01afaf";
const UNSELECTED_ROUTE_COLOR = "#9b9b9b";

const DEFAULT_TAXI_FEE = 3000;


var shortest_direction_result, recommended_direction_result, freeway_direction_result;

const routeDirectionListBox = document.querySelector("#routeDirectionList");
const routeDirectionDetails = document.querySelector("#routeDirectionDetails")

function shortest_path_service_callback(data) {
	shortest_direction_result = directionsService.parseRoute(data);
	var directionsRendererOptions = {
		directions : shortest_direction_result, // 길찾기 결과. DirectionsService 의 parseRoute 결과
		map : map,						// 길찾기 결과를 렌더링할 지도
		keepView : false,				// 현재 뷰 유지 여부. true 이면 현재 뷰를 변경하지 않음. 디폴트 false
		offMarkers : true,				// 마커 표시 억제 여부. true 이면 마커를 표시하지 않음. 디폴트 false
		markerOptions : {			// 마커 옵션
			draggable : false,			// 마커 드래깅 가능 여부. true 이면 마커를 드래그 할 수 있음. 디폴트 false,
			caption : 'test caption',	// 마커 캡션 설정.
			title : '',					// 마커 타이틀 설정.
			flat : true					// 마커의 그림자 표시여부. true이면 마커 그림자가 표시되지 않음. 디폴트 false
		},
		offPolylines : false,			// 경로 폴리라인 억제 여부. true 이면 경로를 표시하지 않음. 디폴트 false
		polylineOptions : {				// 경로 폴리라인 스타일 옵션
			strokeColor : SHORTEST_PATH_COLOR,	// 경로 폴리라인 칼라. 디폴트 #ff3131
			strokeWeight : 3	// 경로 폴리라인 두께. 디폴트 5 
		}
	}; 
	var directionsRenderer = new olleh.maps.DirectionsRenderer(directionsRendererOptions);

	setRouteDirectionDetails(shortest_direction_result);
	directionsRenderer.setMap(map);

	boundList = getBoundsArray(shortest_direction_result);
}

function recommended_path_service_callback(data) {
	recommended_direction_result = directionsService.parseRoute(data);
	var directionsRendererOptions = {
		directions : recommended_direction_result, // 길찾기 결과. DirectionsService 의 parseRoute 결과
		map : map,						// 길찾기 결과를 렌더링할 지도
		keepView : false,				// 현재 뷰 유지 여부. true 이면 현재 뷰를 변경하지 않음. 디폴트 false
		offMarkers : true,				// 마커 표시 억제 여부. true 이면 마커를 표시하지 않음. 디폴트 false
		markerOptions : {				// 마커 옵션
			draggable : false,			// 마커 드래깅 가능 여부. true 이면 마커를 드래그 할 수 있음. 디폴트 false,
			caption : 'test caption',	// 마커 캡션 설정.
			title : '',					// 마커 타이틀 설정.
			flat : true					// 마커의 그림자 표시여부. true이면 마커 그림자가 표시되지 않음. 디폴트 false
		},
		offPolylines : false,			// 경로 폴리라인 억제 여부. true 이면 경로를 표시하지 않음. 디폴트 false
		polylineOptions : {				// 경로 폴리라인 스타일 옵션
			strokeColor : RECOMMENDED_PATH_COLOR,	// 경로 폴리라인 칼라. 디폴트 #ff3131
			strokeWeight : 3			// 경로 폴리라인 두께. 디폴트 5 
		},
	}; 
	var directionsRenderer = new olleh.maps.DirectionsRenderer(directionsRendererOptions);

	setRouteDirectionDetails(recommended_direction_result);
	directionsRenderer.setMap(map);

	boundList = getBoundsArray(recommended_direction_result);
}

function freeway_path_service_callback(data) {
	freeway_direction_result = directionsService.parseRoute(data);
	var directionsRendererOptions = {
		directions : freeway_direction_result, // 길찾기 결과. DirectionsService 의 parseRoute 결과
		map : map,						// 길찾기 결과를 렌더링할 지도
		keepView : false,				// 현재 뷰 유지 여부. true 이면 현재 뷰를 변경하지 않음. 디폴트 false
		offMarkers : true,				// 마커 표시 억제 여부. true 이면 마커를 표시하지 않음. 디폴트 false
		markerOptions : {				// 마커 옵션
			draggable : false,			// 마커 드래깅 가능 여부. true 이면 마커를 드래그 할 수 있음. 디폴트 false,
			caption : 'test caption',	// 마커 캡션 설정.
			title : '',					// 마커 타이틀 설정.
			flat : true					// 마커의 그림자 표시여부. true이면 마커 그림자가 표시되지 않음. 디폴트 false
		},
		offPolylines : false,			// 경로 폴리라인 억제 여부. true 이면 경로를 표시하지 않음. 디폴트 false
		polylineOptions : {				// 경로 폴리라인 스타일 옵션
			strokeColor : FREEWAY_PATH_COLOR,	// 경로 폴리라인 칼라. 디폴트 #ff3131
			strokeWeight : 3			// 경로 폴리라인 두께. 디폴트 5 
		},
	}; 
	var directionsRenderer = new olleh.maps.DirectionsRenderer(directionsRendererOptions);

	setRouteDirectionDetails(freeway_direction_result);
	directionsRenderer.setMap(map);

	boundList = getBoundsArray(freeway_direction_result);
}

function getCallbackString(priorityType) {
	switch(priorityType) {
		case "0" : 
			return "shortest_path_service_callback"
		case "1" : 
			return "highway_path_service_callback"
		case "2" : 
			return "freeway_path_service_callback"
		case "3" : 
			return "recommended_path_service_callback"
		default : 
			return "traffic_path_service_callback"
	}
}

function setRouteDirectionDetails(directionsResult) {
	var displayArray = getDestinationRouteArray(directionsResult);
	var duration = getDuration(directionsResult);
	var distance = getDistance(directionsResult);
	var fee = getFee(directionsResult);

	routeDirectionListBox.textContent = displayArray;
	routeDirectionDetails.querySelector("#duration").textContent = duration;
	routeDirectionDetails.querySelector("#distance").textContent = distance;
	routeDirectionDetails.querySelector("#fee").textContent = fee;
}

function getDestinationRouteArray(durationResult) {
	var destinationArray = [];

	if(durationResult.result.routes.length > 0) {
		durationResult.result.routes.forEach(function(route) {
			if(route.node_name != "" && route.node_name != undefined) {
				destinationArray.push(route.node_name);
			}
		});
	}
	
	var uniqueArray = destinationArray.filter(function(item, pos, self) {
		return self.indexOf(item) == pos;
	});

	var displayArray = [];
	if(uniqueArray.length > 5) {
		var mok = uniqueArray.length/5;
		for(var cnt = 0; cnt < 5; cnt++) {
			displayArray.push(uniqueArray[Math.floor(mok*cnt)]);
		}
	} else {
		displayArray = uniqueArray;
	}

	return displayArray.toString().replace(/,/gi,"\u00a0\u00a0\u00a0\u00a0>\u00a0\u00a0\u00a0\u00a0");
}

function getDuration(directionsResult) {
	var durationMinutes = directionsResult.result.total_duration.value;
	var elapsedHours = Math.floor(durationMinutes / 60);
	var elapsedMinutes = Math.floor((durationMinutes / 60 - elapsedHours) * 60);
	return "약 " + (elapsedHours > 0 ? elapsedHours + "시간" : "") + (elapsedMinutes > 0 ? elapsedMinutes + "분" : "");
}

function getDistance(directionsResult) {
	var distanceInKm = directionsResult.result.total_distance.value/1000;
	return "약 " + parseFloat(distanceInKm).toFixed(1) + "km";
}

function getFee(directionsResult) {
	var distanceInKm = directionsResult.result.total_distance.value/1000;
	return "택시비 약 " + (Math.floor(distanceInKm) * 1000 <= DEFAULT_TAXI_FEE ? DEFAULT_TAXI_FEE : Math.floor(distanceInKm) * 1000) + "원";
}
