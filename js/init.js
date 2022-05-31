// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':12};


const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMt8H8_IxDwp7w2FodNYx_h4tXCUINMQoU0rlQiJhwHQK0hWUHWj9YM0Axo6lRoVZb9fde6A7RypjQ/pub?output=csv";

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

let Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
//go to adobe, get three dif colors
Esri_WorldStreetMap.addTo(map);

let safe = L.markerClusterGroup();
let notSafe = L.markerClusterGroup();
let notSafeEver = L.markerClusterGroup();

//adding variables to keep track of count for chart
let countSafe = 0;
let countnotSafe = 0;
let countnotSafeEver = 0;



let globalColors = { 
    "safeColor" : "#B34736", //can have hex code
    "stillUnsafe" : "#FF7B66",
    "nowUnsafe" : "#3865B3"
}

// let safeColor = "green";
// let stillUnsafe = "red";
// let nowUnsafe = "purple";

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
    let UserPerceptionPasser = data['How has the incident changed your perception of safety at UCLA?']
    let UserFeelingPasser =  data['How do you feel after the incident? Feel free to share any feelings or emotions.  We would like to reiterate that this form is completely anonymous and will not be traced back to you. '] 
    let PerceptionColor = getPerceptionColor(UserPerceptionPasser);
    circleOptions.fillColor = PerceptionColor;
    console.log(circleOptions.fillColor)

    if (UserFeelingPasser.length <= 2){
        UserFeelingPasser = "No response";
    }

    if( UserPerceptionPasser == "No, I still feel safe at UCLA"){
        
        // circleOptions.fillColor = getPerceptionColor(UserPerceptionPasser)
        safe.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>No, I still feel safe at UCLA</h2>`))
        countSafe += 1;

       // createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        }
    else if(UserPerceptionPasser  == "No, before and after the incident I feel unsafe at UCLA"){
        
        // circleOptions.fillColor = getPerceptionColor(UserPerceptionPasser)
        notSafeEver.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>I no longer feel safe at UCLA</h2>`))
        countnotSafeEver+=1;
       
       // createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        
    }
    else{
        
        // circleOptions.fillColor = "blue"  
        notSafe.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>No, before and after the incident I feel unsafe at UCLA</h2>`))
        countnotSafe +=1;
     //   createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
    }
    addslides(data.lat,data.lng, UserFeelingPasser, PerceptionColor)
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

//create similar function for slideshow 
function addslides(lat, lng, UserFeelings, UserPerceptionColor ){
    const newSlide = document.createElement("div"); // adds a new slide, creating the div
    let slideClass = "mySlides";
    // let slideColor = getPerceptionColor(UserPerception);
    newSlide.style.backgroundColor = UserPerceptionColor;
    newSlide.id = "button"+UserFeelings; // gives the button a unique id
    newSlide.innerHTML = UserFeelings; // gives the button a title
    newSlide.setAttribute("lat",lat); // sets the latitude 
    newSlide.setAttribute("lng",lng); // sets the longitude 
    newSlide.className = slideClass; //change slideClass either here or top (variable declaration)
    newSlide.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })


    const slideArea = document.getElementById('slideArea')
    slideArea.appendChild(newSlide);//this adds the slide to our page.
//prepend 
};

function getPerceptionColor(UserPerception){
    
    let slideColor;
    
    switch(UserPerception) { //(helper function) can turn into function... 
        case "No, I still feel safe at UCLA.": //will continuosly refer to 
            slideColor = globalColors.safeColor; //assign class, change only once
            return slideColor
        case "Yes, I no longer feel safe at UCLA due to the incident.":
            slideColor = globalColors.stillUnsafe;
            return slideColor
        case "No, before and after the incident I feel unsafe at UCLA":
            slideColor = globalColors.nowUnsafe
            return slideColor
        
    }
    console.log(UserPerception)
}
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
            backgroundColor: [globalColors.safeColor, globalColors.stillUnsafe, globalColors.nowUnsafe],
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
        
        // console.log(data)
        addMarker(data)
        
        
        
    })
  
    safe.addTo(map) // add our layers after markers have been made
    notSafe.addTo(map) // add our layers after markers have been made  
    notSafeEver.addTo(map)
    addChart()

    let allLayers = L.featureGroup([safe,notSafe,notSafeEver]);
    map.fitBounds(allLayers.getBounds());
    showSlides(slideIndex);//slide added 
};


//

loadData(dataUrl)

var slideIndex = 1;


function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
} 
//test
// Creating window object
var win =  L.control.window(map,{title:'Welcome to Chinese Discriminaion Map',content:'This is my first control window.'})
           .show()
