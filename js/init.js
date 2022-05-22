// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':15};

let safe = L.featureGroup();
let notSafe = L.featureGroup();
let notSafeEver = L.featureGroup();

let layers = {
    "Still feel safe at UCLA": safe,
    "Before and After, I feel unsafe": notSafe,
    "No longer feel safe":notSafeEver
    

};

let circleOptions = {
    radius: 4,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMt8H8_IxDwp7w2FodNYx_h4tXCUINMQoU0rlQiJhwHQK0hWUHWj9YM0Axo6lRoVZb9fde6A7RypjQ/pub?output=csv";

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);

// add layer control box
L.control.layers(null,layers).addTo(map);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

function addMarker(data){
    if(data['How has the incident changed your perception of safety at UCLA?'] == "No, I still feel safe at UCLA"){
        circleOptions.fillColor = "red"
        safe.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>No, I still feel safe at UCLA</h2>`))
        createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        }
    else if(data['How has the incident changed your perception of safety at UCLA?'] == "No, before and after the incident I feel unsafe at UCLA"){
        circleOptions.fillColor = "green"
        notSafe.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>No, before and after the incident I feel unsafe at UCLA</h2>`))
        createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        
    }
    else{
        circleOptions.fillColor = "blue"
        notSafeEver.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Non-English First Language</h2>`))
        createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
    }
    return data
};

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
};

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
};

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
    })
    englishFirst.addTo(map) // add our layers after markers have been made
    nonEnglishFirst.addTo(map) // add our layers after markers have been made  
    let allLayers = L.featureGroup([englishFirst,nonEnglishFirst]);
    map.fitBounds(allLayers.getBounds());
};

loadData(dataUrl)
