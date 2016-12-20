let firebaseDB;

let connectDatabase = () => {
	const config = {
		databaseURL: "https://wayknower.firebaseio.com/"
	}
	firebase.initializeApp(config);
	firebaseDB = firebase.database();
}

let generateDatabaseKey = () => {
	let firebaseRef = firebaseDB.ref();

	let key = firebaseRef.push().key;
	return key;
}

let updateCoordinatesByKey = (latitude, longitude, key) => {
	let firebaseRef = firebaseDB.ref();

	let coordinates = {
		latitude: latitude,
		longitude: longitude
	}

	let updates = {};
	updates[key] = coordinates;
	firebaseRef.update(updates);

	//TODO: 기존 마커 지우는 로직 필요

	// let marker = new olleh.maps.overlay.Marker({
	// 	position: new olleh.maps.UTMK(coordinates.latitude, coordinates.longitude),
	// 	map: map
	// });
}

let receiveCoordinatesByKey = (key) => {
	let firebaseRef = firebaseDB.ref(key);

	firebaseRef.on('value', (snapshot) => {
		const coordinates = snapshot.val();
		console.log("따른 사람들 화면");
		console.log(coordinates);
		//TODO: 기존 마커 지우는 로직 필요

		// let marker = new olleh.maps.overlay.Marker({
		// 	position: new olleh.maps.UTMK(coordinates.latitude, coordinates.longitude),
		// 	map: map
		// });
	})
}