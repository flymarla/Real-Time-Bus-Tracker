mapboxgl.accessToken = 'pk.eyJ1IjoiZmx5bWFybGEiLCJhIjoiY2t2cjEwcngwN216ajJwbXNlY2J1d2g2MCJ9.1c4hqu3Yh2U1F9fFlVVSFA';

// Loads map with center at middle of Harvard Bridge
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.091254, 42.354439],
    zoom: 12.8,
  });


// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
    console.log("data: ", json.data[0]);
	return json.data;
}

// set markers
const marker=[];
const popup = [];
const setMarkers = (move) => {
    // add markers to map
    if (move === false) {
        busInfo.forEach(function(coords, index, array){
            const element = document.createElement('div');
            element.id = 'marker';
            element.className = 'marker';
            console.log("Array: ", array);
            console.log("Index: ", index);
            console.log("Coordinates ", coords);
            let popTexthtml = "Bus Number: " + coords["busNum"] + "<br> Status: " + coords["status"] + "<br> Headed: " + coords["direction"];
            popup[index] = new mapboxgl.Popup({ offset: 25}).setHTML(popTexthtml);
            marker[index] = new mapboxgl.Marker(element)
            .setLngLat(coords["coordinates"])
            .setPopup(popup[index])
            .addTo(map);
        });
    };
    // move markers already on map
    if (move === true){
        busInfo.forEach(function(coords, index, array){
            console.log("Move Array: ", array);
            console.log("Move Index: ", index);
            console.log("Move Coordinates ", coords);
            popTexthtml = "Bus Number: " + coords["busNum"] + "<br> Status: " + coords["status"] + "<br> Headed: " + coords["direction"];
            marker[index]
                .setLngLat(coords["coordinates"])
                .setPopup(popup[index]);
        });    
    }
    
}; 



// get new bus locations
async function run(){  
    move = true;  
	const locations = await getBusLocations();
    const buses = locations.length;
    for (let j = 0; j < buses; j++) {
        let lng = locations[j]["attributes"]["longitude"];
        let lat = locations[j]["attributes"]["latitude"];
        let busNum = locations[j]["attributes"]["label"];
        let status = locations[j]["attributes"]["occupancy_status"];
        let direction = locations[j]["attributes"]["direction_id"];
        if(direction === 1){
            dirWords = "Inbound Nubian";
        };
        if (direction === 0) {
            dirWords = "OutBound Harvard";
        };
        let newObj = {
            "coordinates": [lng, lat],
            "busNum": busNum,
            "status": status,
            "direction": dirWords
        };
        busInfo[j] = newObj;             
    }
    setMarkers(move);
	
	setTimeout(run, 15000);
}


// Get initial Marker coordinates & bus info
let busInfo = [];
let move = false;
async function markers(){
    const initLocations = await getBusLocations();
    const numBuses =  initLocations.length;
    console.log('Number of Buses: ', numBuses);
    let dirWords = '';
    for (let i = 0; i < numBuses; i++){
        let firstlng = initLocations[i]["attributes"]["longitude"];
        let firstlat = initLocations[i]["attributes"]["latitude"];
        let busNum = initLocations[i]["attributes"]["label"];
        let status = initLocations[i]["attributes"]["occupancy_status"];
        let direction = initLocations[i]["attributes"]["direction_id"];
        if(direction === 1){
            dirWords = "Inbound Nubian";
        };
        if (direction === 0) {
            dirWords = "OutBound Harvard";
        };
        //console.log("Markers bus #: ", i, " longitude: ", firstlng, " latitude: ", firstlat, " label ", busNum);
        let obj = {
            "coordinates": [firstlng, firstlat],
            "busNum": busNum,
            "status": status,
            "direction": dirWords
        };
        busInfo.push(obj);
     };
     setMarkers(move);
     
};

markers();

 













