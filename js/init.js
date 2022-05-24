// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':15};


const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMt8H8_IxDwp7w2FodNYx_h4tXCUINMQoU0rlQiJhwHQK0hWUHWj9YM0Axo6lRoVZb9fde6A7RypjQ/pub?output=csv";

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);

let safe = L.featureGroup();
let notSafe = L.featureGroup();
let notSafeEver = L.featureGroup();

//adding variables to keep track of count for chart
let countSafe = 0;
let countnotSafe = 0;
let countnotSafeEver = 0;

let layers = {
    "Still feel safe at UCLA": safe,
    "Before and After, I feel unsafe": notSafe,
    "No longer feel safe":notSafeEver
};

let circleOptions = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.3
};


// add layer control box
L.control.layers(null,layers).addTo(map);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);




function addMarker(data){
    if(data['How has the incident changed your perception of safety at UCLA?'] == "No, I still feel safe at UCLA"){
        
        circleOptions.fillColor = "red"
        safe.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>No, I still feel safe at UCLA</h2>`))
        countSafe += 1;

       // createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        }
    else if(data['How has the incident changed your perception of safety at UCLA?'] == "No, before and after the incident I feel unsafe at UCLA"){
        
        circleOptions.fillColor = "green"
        notSafeEver.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>I no longer feel safe at UCLA/h2>`))
        countnotSafeEver+=1;
       
       // createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        
    }
    else{
        
        circleOptions.fillColor = "blue"  
        notSafe.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>No, before and after the incident I feel unsafe at UCLA</h2>`))
        countnotSafe +=1;
     //   createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
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



function addChart(){
    // create the new chart here, target the id in the html called "chart"
    new Chart(document.getElementById("chart"), {
        type: 'bar', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["Still feel safe","Before and After, I feel unsafe","No longer feel safe"],
        datasets: [
            {
            label: "Count",
            backgroundColor: ["green", "red", "blue"],
            data: [countSafe,countnotSafe,countnotSafeEver]
            }
        ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            title: {
                display: true,
                text: 'Survey Respondants'
            }
        }
    });
}

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
        addChart()
        
        
    })
  
    safe.addTo(map) // add our layers after markers have been made
    notSafe.addTo(map) // add our layers after markers have been made  
    notSafeEver.addTo(map)
    

    let allLayers = L.featureGroup([safe,notSafe,notSafeEver]);
    map.fitBounds(allLayers.getBounds());
};


loadData(dataUrl)
