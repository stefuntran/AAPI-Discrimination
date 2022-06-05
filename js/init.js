
// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':15};


// 🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙 add the scroller llama 🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙🦙
let scroller = scrollama();


const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlkin3Dn1TCTm5XgCqwLjV5VMMuC_578Sbe26vQYTZfwsbVNZ9TlM8tWLRh9EQVgxsk85oyKN21yOZ/pub?output=csv";

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
    "safeColor" : "#3865B3", //can have hex code
    "stillUnsafe" : "#FF7B66",
    "nowUnsafe" : "#B34736"
}

// let safeColor = "green";
// let stillUnsafe = "red";
// let nowUnsafe = "purple";

let layers = {
    "Still feel safe at UCLA <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='#3865B3' stroke-width='1' fill= '#3865B3'/></svg>": safe,
    "Before and After, I feel unsafe <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='#FF7B66' stroke-width='1' fill= '#FF7B66'/></svg>": notSafe,
    "No longer feel safe <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='#B34736' stroke-width='1' fill= '#B34736'/></svg>":notSafeEver,

};

let circleOptions = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7
};


let templayer;

// add layer control box
L.control.layers(null,layers,{collapsed:false}).addTo(map)

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

function processData(results){
    console.log(results)
   
    results.data.forEach(data => {
        let UserPerceptionPasser = data['How has the incident changed your perception of safety at UCLA?']
        let UserCovid = data["Do you feel that COVID-19 has played a role in the motivation of this incident? "]
        let UserFeelingPasser =  data['How do you feel after the incident? Feel free to share any feelings or emotions.  We would like to reiterate that this form is completely anonymous and will not be traced back to you. '] 
        let PerceptionColor = getPerceptionColor(UserPerceptionPasser);
        let UserEvent = data["Please feel free to describe what happened if you feel comfortable doing so. Feel free to go into as much detail as you wish."]

        let surveyData = {
            "perception": UserPerceptionPasser,
            "covid": UserCovid,
            "feeling": UserFeelingPasser,
            "lat": data.lat,
            "lng": data.lng,
            "color":PerceptionColor,
            "event": UserEvent
        }
        // console.log(data)
        addMarker(surveyData)
    })

  
    safe.addTo(map) // add our layers after markers have been made
    notSafe.addTo(map) // add our layers after markers have been made  
    notSafeEver.addTo(map)
    addChart("all")
    let allLayers = L.featureGroup([safe,notSafeEver,notSafe]);
    map.fitBounds(allLayers.getBounds());
    map.scrollWheelZoom.disable()
    scroller.setup({
        step: ".defaultCards", // this is the name of the class that we are using to step into, it is called "step", not very original
    })
    // do something when you enter a "step":
    .onStepEnter((response) => {
        // you can access these objects: { element, index, direction }
        // use the function to use element attributes of the button 
        // it contains the lat/lng: 
        scrollStepper(response.element.attributes)
        highlightCard(response.element)
    })
    .onStepExit((response) => {
        // { element, index, direction } 🦙🦙🦙🦙
        // left this in case you want something to happen when someone
        // steps out of a div to know what story they are on.
        unhighlightCard(response.element)
    });
};

function addMarker(data){

//get if statement to work

    //add marker to map then remove marker if it already exists

    // let UserPerceptionPasser = data['How has the incident changed your perception of safety at UCLA?']
    // let UserCovid = data["Do you feel that COVID-19 has played a role in the motivation of this incident? "]
    // let UserFeelingPasser =  data['How do you feel after the incident? Feel free to share any feelings or emotions.  We would like to reiterate that this form is completely anonymous and will not be traced back to you. '] 
    // let PerceptionColor = getPerceptionColor(UserPerceptionPasser);

    circleOptions.fillColor = data.color;
    // console.log(circleOptions.fillColor)


    // let surveyData = {
    //     "perception": UserPerceptionPasser,
    //     "covid": UserCovid,
    //     "feeling": UserFeelingPasser,
    //     "lat": data.lat,
    //     "lng": data.lng,
    //     "color":PerceptionColor
    // }
    

    if (data.feeling.length <= 2){
        data.feeling = "No response";
    }

    totalMarkerCount += 1
    if( data.perception == "No, I still feel safe at UCLA."){
        thisMarker = L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>${data.event}</h2> <h3>${data.feeling}</h3>`)
        thisMarker._id = totalMarkerCount
        // circleOptions.fillColor = getPerceptionColor(UserPerceptionPasser)
        safe.addLayer(thisMarker)
        countSafe += 1;

       // createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        }
    else if(data.perception  == "No, before and after the incident I feel unsafe at UCLA"){
        thisMarker = L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>${data.event}</h2> <h3>${data.feeling}</h3>`)
        // circleOptions.fillColor = getPerceptionColor(UserPerceptionPasser)
        thisMarker._id = totalMarkerCount
        notSafeEver.addLayer(thisMarker)
        countnotSafeEver+=1;
       
       // createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
        
    }
    else{
        thisMarker = L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>${data.event}</h2> <h3>${data.feeling}</h3>`)
        thisMarker._id = totalMarkerCount
        // circleOptions.fillColor = "blue"  
        notSafe.addLayer(thisMarker)
        countnotSafe +=1;
     //   createButtons(data.lat,data.lng,data['Where did this occur? Please be specific by providing the building name or dorm. If you need a map, please take a look at the map provided below. If you would prefer to go on the website itself, here is the link! https://map.ucla.edu/'])
    }
    addCards(data)

    // make a copy of each of the surveyData objects and add it to the all card data array
    allthecardData.push(data) 
    


    return data
};
let allthecardData = []// make copy bc we will delete after
let totalMarkerCount = 0;

//create similar function for slideshow 
function addCards(data){

    const newCard = document.createElement("div"); // adds a new slide, creating the div
    // let slideClass = "mySlides";
    newCard.className = "defaultCards";
    // let slideColor = getPerceptionColor(UserPerception);
    
    // newCard.setAttribute("class","step") 🦙🦙🦙🦙🦙🦙🦙🦙🦙
    newCard.setAttribute("data-step",totalMarkerCount)
    newCard.style.backgroundColor = data.color;
    newCard.id = "llama_id_"+totalMarkerCount; // gives the button a unique id
    
    newCard.innerHTML = `<div class="title">${data.feeling}</div><p>${data.event}</p><h3>Has covid affected?</h3><p>${data.covid}`; // gives the button a title
    newCard.setAttribute("lat",data.lat); // sets the latitude 
    newCard.setAttribute("lng",data.lng); // sets the longitude 
    newCard.setAttribute("feeling",data.perception); // remove card when you click button, 
    //show all, covid etc, one function 

    // newCard.className = slideClass; //change slideClass either here or top (variable declaration)
    newCard.addEventListener('click', function(){
        map.flyTo([data.lat,data.lng]); //this is the flyTo from Leaflet
    })

//add covid
    const scrollAreaSelector = document.getElementById('scrollArea')
    scrollAreaSelector.appendChild(newCard);//this adds the slide to our page.
    totalMarkerCount +=1;
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
//html in java


function filterData(filter){
    console.log('you clicked the button!!!! '+filter)
    filterMap(filter)
    filterCards(filter)
    filterChart(filter)
}

function removeCards(){
    document.getElementsById("scrollArea").innerHTML = "";
}


function filterCards(filter){
    //filter card based on feedling 
        
    removeCards()
    //do if not all 

        // remove everything
    //replace map = https://bobbyhadz.com/blog/javascript-get-all-elements-by-data-attribute

    // add everything if filter is all
    if (filter == "all"){
        //add all of the cards
        //if empty
        
        addCards(allthecardData)
    }

    const elements2 = document.querySelectorAll(`[feeling="${filter}"]'`);
    if (filter == "stillSafe"){
        
        addCards(filter)
        
    }

    ////////////////////// todo please check this!
    if (filter == "beforeAfter"){
        addCards(filter)
    }

    if (filter == "notSafe"){
        addCards(filter)
    }
}

function filterMap(filter){
    map.eachLayer(function(layer){
        map.removeLayer(layer)})

    if (filter == "all"){
        map.addLayer(allLayers)
    }

    if (filter == "stillSafe"){
        map.addLayer(safe)
    }

    ////////////////////// todo please check this!
    if (filter == "beforeAfter"){
        map.addLayer(notSafeEver)
    }

    if (filter == "notSafe"){
        map.addLayer(notSafe)
    }
}
//make copy of card so that we can add back in


function addChart(chartDisplay){

    let chartData = []
    if (chartDisplay == "all"){
        chartData = [countSafe,countnotSafe,countnotSafeEver]
    }

    if (chartDisplay == "stillSafe"){
        chartData = [countSafe]
    }

    ////////////////////// todo please fix this!
    if (chartDisplay == "beforeAfter"){
        chartData = [stillUnsafe]
    }

    if (chartDisplay == "notSafe"){
        chartData = [nowUnsafe]
    }
    ///////////////////// do same for cards and filter, have default view for cards and map

    
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
            data: chartData //add depending on what button is pressed
            }
            //add paramete chartdisplay if chart display 
        ]
        },
        options: {
            scales: {
                y: {
                  ticks: {
                    stepSize: 1,
                    beginAtZero: true,
                  },
                },
              },
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





//add filter for button and cards 

function highlightCard(selectedCard){
    // console.log('into highlightCard')
    console.log(selectedCard.id.value)

    let card = document.getElementById(selectedCard.id.value).className += " highlightCard";
    console.log(card)
    // card.style.className = "highlightCard";
    // console.log(card)

}

function unhighlightCard(selectedCard){
    let highlights = document.getElementsByClassName("highlightCard");
    while (highlights.length)
        highlights[0].className = highlights[0].className.replace(/\bhighlightCard\b/g, "");
    //  document.getElementById(selectedCard.id.value);
    //  let card =  // Code wrapped for readability above is all one statement
    // card.style.className = "defaultCards";
}

function scrollStepper(thisStep){
    highlightCard(thisStep)
    // console.log('into scrollStepper')
    // console.log(thisStep)
    // optional: console log the step data attributes:
    // console.log("you are in thisStep: "+thisStep)
    let thisLat = thisStep.lat.value
    let thisLng = thisStep.lng.value
    // tell the map to fly to this step's lat/lng pair:
    map.flyTo([thisLat,thisLng],18,{padding: [50,50]})
}



//

loadData(dataUrl)


//test
// Creating window object
// var win =  L.control.window(map,{title:'Welcome to Chinese Discriminaion Map',content:'insert introduction to project and how to use'}).show()

