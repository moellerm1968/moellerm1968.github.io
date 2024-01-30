var routes = new H.map.Group();

var urlParams = new URLSearchParams(window.location.search);

var routingdata = {
  isbt_laenge: urlParams.get('isbt_l'),
  isbt_dauer: urlParams.get('isbt_d'),
  origin: {lat: urlParams.get('Origin').split(",")[0], lng: urlParams.get('Origin').split(",")[1]},
  destination: {lat: urlParams.get('Dest').split(",")[0], lng: urlParams.get('Dest').split(",")[1]},
  departureTime: urlParams.get('Departuretime'),
  vehicleType: urlParams.get('Vehicletype'),
  result:[{ duration: 0.0, length: 0.0},{ duration: 0.0, length: 0.0},{ duration: 0.0, length: 0.0},{ duration: 0.0, length: 0.0},{ duration: 0.0, length: 0.0}],
  polylines:[ null, null, null, null ],
  addParam:  '&algopts=truckIntersectionDelaySpeedCat5MSec:1000&speedFcCat=80,80,80,80,70,56,35,10;80,80,80,75,65,49,35,10;80,80,74,70,60,48,35,10;60,60,60,60,57,40,30,10;50,48,46,42,39,22,19,10;,,,,,,,',
  addParam2: '&algopts=truckIntersectionDelaySpeedCat5MSec:2000&speedFcCat=80,80,80,75,65,45,25,10;60,60,60,60,60,45,25,10;60,60,60,60,60,45,25,10;50,50,50,50,47,30,12,10;30,30,30,30,19,15,11,10;,,,,,,,'
};

var vehicleTypes =[ 
  { 
      "VehicleType": 1,
      "Description": "Transporter <= 2,8 t",
      "Height": 3.35,
      "Width": 2.28,
      "Length": 5.78,
      "AxlesCount": 2,
      "MaxAllWeigth": 2.8,
      "EmissionType": 6,
      "MaxAllSpeed": 130,
      "TollVehicleType": 2,
      "Mode": "car",
      "speedFcCat": "117,115,107,87,62,38,18,10;115,111,93,87,62,38,17,10;111,107,86,83,61,37,15,10;60,60,60,60,56,36,14,10;36,36,36,36,23,18,13,10;,,,,,,,", // Nur Fleet Telematics
      "algopts": "truckIntersectionDelaySpeedCat5MSec:1000" // Nur Fleet Telematics
    },
    { 
      "VehicleType": 2,
      "Description": "Transp>2,8 t<=3,5 t",
      "Height": 2.57,
      "Width": 2.55,
      "Length": 7.12,
      "AxlesCount": 2,
      "MaxAllWeigth": 3.5,
      "EmissionType": 6,
      "MaxAllSpeed": 130,
      "TollVehicleType": 2,
      "Mode": "car",
      "speedFcCat": "116,114,106,86,61,38,18,10;114,110,92,86,61,38,17,10;110,106,85,83,60,37,15,10;59,59,59,59,55,35,14,10;35,35,35,35,22,18,13,10;,,,,,,,", // Nur Fleet Telematics
      "algopts": "truckIntersectionDelaySpeedCat5MSec:1000" // Nur Fleet Telematics
    },
    {
      "VehicleType": 3,
      "Description": "Lkw <= 7,5t",
      "Height": 3.35,
      "Width": 2.55,
      "Length": 7.9,
      "AxlesCount": 2,
      "MaxAllWeigth": 7.49,
      "EmissionType": 6,
      "MaxAllSpeed": 80,
      "TollVehicleType": 9,
      "Mode": "truck",
      "speedFcCat": "78,78,78,73,63,44,24,10;58,58,58,58,58,44,24,10;58,58,58,58,58,44,24,10;49,49,49,49,46,29,12,10;29,29,29,29,18,15,11,10;,,,,,,,", // Nur Fleet Telematics
      "algopts": "truckIntersectionDelaySpeedCat5MSec:2000" // Nur Fleet Telematics
    },
    {
      "VehicleType": 4,
      "Description": "Lkw >7,5 t <=11,99 t",
      "Height": 3.4,
      "Width": 2.55,
      "Length": 9.18,
      "AxlesCount": 2,
      "MaxAllWeigth": 11.99,
      "EmissionType": 6,
      "MaxAllSpeed": 80,
      "TollVehicleType": 3,
      "Mode": "truck",
      "speedFcCat": "74,74,74,69,60,41,23,10;55,55,55,55,55,41,23,10;55,55,55,55,55,41,23,10;46,46,46,46,43,28,11,10;28,28,28,28,18,14,10,10;,,,,,,,", // Nur Fleet Telematics
      "algopts": "truckIntersectionDelaySpeedCat5MSec:2000" // Nur Fleet Telematics
    },
    {
      "VehicleType": 5,
      "Description": "Lkw >=12 t <=23 t",
      "Height": 4.0,
      "Width": 2.55,
      "Length": 9.95,
      "AxlesCount": 2,
      "MaxAllWeigth": 23,
      "EmissionType": 6,
      "MaxAllSpeed": 80,
      "TollVehicleType": 3,
      "Mode": "truck",
      "speedFcCat": "74,74,74,69,60,41,23,10;55,55,55,55,55,41,23,10;55,55,55,55,55,41,23,10;46,46,46,46,43,28,11,10;28,28,28,28,18,14,10,10;,,,,,,,", // Nur Fleet Telematics
      "algopts": "truckIntersectionDelaySpeedCat5MSec:2000" // Nur Fleet Telematics
    },
    { 
      "VehicleType": 6,
      "Description": "Lkw > 23 t",
      "Height": 4.0,
      "Width": 2.5,
      "Length": 9.6,
      "AxlesCount": 3, //29% have 5 axles, rest 3axles
      "MaxAllWeigth": 26, //29% (type 71) have 40tons, rest mainly 26tons
      "EmissionType": 6,
      "MaxAllSpeed": 80,
      "TollVehicleType": 3,
      "Mode": "truck",
      "speedFcCat": "74,74,74,69,60,41,23,10;55,55,55,55,55,41,23,10;55,55,55,55,55,41,23,10;46,46,46,46,43,28,11,10;28,28,28,28,18,14,10,10;,,,,,,,", // Nur Fleet Telematics
      "algopts": "truckIntersectionDelaySpeedCat5MSec:2000" // Nur Fleet Telematics
    },];
    
var Duration = "0,0 h"
var Laenge = "0,0 km"

// set up containers for the map  + panel
var mapContainer = document.getElementById('map');
var platform = new H.service.Platform({apikey: 'gET017F3PS1alYkXek5T9nAaTOXycH6bKRzcrOG_6eE'});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
  // Set truck restriction layer as a base map
  defaultLayers.vector.normal.truck,{
  center: routingdata.origin,
  zoom: 5,
  pixelRatio: window.devicePixelRatio || 1
});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

drawMarker(routingdata.origin, 'Start');
drawMarker(routingdata.destination, 'Ziel');
map.addObject(routes);
// Now use the map as required...

routes.addEventListener('tap', function (evt) {
  // event target is the marker itself, group is a parent event target
  // for all objects that it contains
  var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
    // read custom data
    content: evt.target.getData()
  });
  // show info bubble
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  ui.addBubble(bubble);
}, false);

// mit Fahrzeugspezifischen Parametern 
loadHereFleetNew("yes").then((ergebnis) => show(ergebnis, 'black',3));
// mit Globalen Parametern 
loadHereFleetNew(routingdata.addParam).then((ergebnis) => show(ergebnis, 'green',1));
// ohne Parameter
loadHereFleetNew().then((ergebnis) => show(ergebnis, 'red',2));
loadPTV(routingdata.origin, routingdata.destination, routingdata.departureTime).then((ergebnis) => showPTV(ergebnis, 'yellow',4));
calculateRoutesNew (platform);

function show(route, colour='blue', pos){
  if (route==null)
  {
     routingdata.result[pos].length=-1.0;
     addRoutingInfoToPage();
     return;
  }
  // Save data to result object
  routingdata.result[pos].length=route.summary.distance/1000;
  routingdata.result[pos].duration=route.summary.travelTime/60;
  // Generatate line for Map
  var linestring = new H.geo.LineString();
  route.leg[0].link.forEach((link) => 
  {
    for (var i=0; i<link.shape.length;i+=2){
      linestring.pushPoint({lat: link.shape[i], lng: link.shape[i+1]});
    }
  });
  const polyline = new H.map.Polyline(linestring,{ style: { lineWidth: 6, strokeColor: colour, lineDash: [1, 8], lineDashOffset: pos*2, lineTailCap: 'arrow-tail', lineHeadCap: 'arrow-head' }});
  // Add Line to Map
  routes.addObject(polyline);
  setZoom();
  addRoutingInfoToPage();
  routingdata.polylines[pos]=polyline;
}


function setZoom() {
  
  let box = routes.getBoundingBox();
  let newbox = new H.geo.Rect(box.getTop()*1.0002,box.getLeft(), box.getBottom(), box.getRight());
  map.getViewModel().setLookAtData({
    bounds: newbox
  });
  map.addEventListener('mapviewchangeend', stepUp )
}

function stepUp (){
  var zoom = map.getZoom();
  console.log(zoom);
  map.removeEventListener('mapviewchangeend', stepUp);
  map.setZoom(zoom*0.99); 
}

function showPTV(route, colour, pos){
  if (route==null)
  {
     routingdata.result[pos].length=-1.0;
     addRoutingInfoToPage();
     return;
  }
  // Save data to result object
  routingdata.result[pos].length=route.distance/1000;
  routingdata.result[pos].duration=route.travelTime/60;
  // Generatate line for Map
  const obj= JSON.parse(route.polyline);
  var linestring = new H.geo.LineString();
  obj.coordinates.forEach((link) => 
  {
    linestring.pushPoint({lat: link[1], lng: link[0]});
  });
  const polyline = new H.map.Polyline(linestring,{ style: { lineWidth: 6, strokeColor: colour, lineDash: [1, 8], lineDashOffset: pos*2, lineTailCap: 'arrow-tail', lineHeadCap: 'arrow-head' }});
  // Add Line to Map
  routes.addObject(polyline);
 setZoom();
  routingdata.polylines[pos]=polyline;
  addRoutingInfoToPage();
}


function drawMarker(coord, text)
{
  const myMarker = new H.map.Marker(coord);
  myMarker.setData(text + "<br>Latitude: " + coord.lat + "<br>Longitude: " + coord.lng) ;
  routes.addObject(myMarker); 
  
}


function calculateRoutesNew(platform) {

  var router = platform.getRoutingService(null, 8);
  let fahrzeug = vehicleTypes.find(fahrzeug => fahrzeug.VehicleType == routingdata.vehicleType);

  var routeParam = {
    routingMode: 'fast',
    transportMode: fahrzeug.Mode,
    return: 'polyline,travelSummary',
    units: 'metric',
    spans: 'truckAttributes',
    origin: routingdata.origin.lat + "," + routingdata.origin.lng, 
    destination: routingdata.destination.lat + "," + routingdata.destination.lng,
    departureTime: routingdata.departureTime
  }
  
  if (fahrzeug.Mode==="truck"){ 
    
      routeParam = { ...routeParam, ...{
        "vehicle[height]": Math.round(fahrzeug.Height*100),
        "vehicle[width]": Math.round(fahrzeug.Width*100),
        "vehicle[length]": Math.round(fahrzeug.Length*100),
        "vehicle[grossWeight]": Math.round(fahrzeug.MaxAllWeigth*1000)
       }};  
    } 
   
    calculateRoute(router, routeParam, {
    strokeColor: 'blue',
    lineWidth: 5, lineDash: [1, 8], lineDashOffset: 0
  });
}



function calculateRoute (router, params, style) {
   router.calculateRoute(params, function(result) {
    addRouteShapeToMap(style, result.routes[0]);
    saveRoutingInfo(result.routes[0].sections);
    addRoutingInfoToPage();

  }, console.error);
}

function saveRoutingInfo(sections){
	var duration=0.0;
	var length=0.0;
	sections.forEach((section) => {
		duration += section.travelSummary.duration/60;
		length += section.travelSummary.length/1000;
    });
	routingdata.result[0].duration=duration;
    routingdata.result[0].length=length;
}

function addRoutingInfoToPage(){
  document.getElementById('StrISBT').textContent=routingdata.isbt_laenge;
  document.getElementById('Str1').textContent=routingdata.result[0].length.toFixed(2).replace('.', ',');
  document.getElementById('Str2').textContent=routingdata.result[2].length.toFixed(2).replace('.', ',');
  document.getElementById('Str3').textContent=routingdata.result[1].length.toFixed(2).replace('.', ',');
  document.getElementById('Str4').textContent=routingdata.result[3].length.toFixed(2).replace('.', ',');
  document.getElementById('Str5').textContent=routingdata.result[4].length.toFixed(2).replace('.', ',');
  document.getElementById('DauerISBT').textContent=minutes2HHMMSS(routingdata.isbt_dauer.replace(',', '.'));
  document.getElementById('Dauer1').textContent=minutes2HHMMSS(routingdata.result[0].duration);
  document.getElementById('Dauer2').textContent=minutes2HHMMSS(routingdata.result[2].duration);
  document.getElementById('Dauer3').textContent=minutes2HHMMSS(routingdata.result[1].duration);
  document.getElementById('Dauer4').textContent=minutes2HHMMSS(routingdata.result[3].duration);
  document.getElementById('Dauer5').textContent=minutes2HHMMSS(routingdata.result[4].duration);
  document.getElementById('addParams').value=routingdata.addParam;
  }


function minutes2HHMMSS(minutes){
  return new Date(minutes *60 * 1000).toISOString().substring(11, 19);
} 


function addRouteShapeToMap(style, route){
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    let polyline = new H.map.Polyline(linestring, {
      style: style
    });

    // Add the polyline to the map
    routes.addObject(polyline);
    // And zoom to its bounding rectangle
    setZoom();
    routingdata.polylines[0]=polyline;

  });
}

async function loadHereFleetNew(addParameter=""){

  const url = "https://fleet.ls.hereapi.com/2/calculateroute.json";
       
  let fahrzeug = vehicleTypes.find (fahrzeug => fahrzeug.VehicleType == routingdata.vehicleType);
    
  var HereTelematicsParameter = {
        "mode": "fastest;"+fahrzeug.Mode+";traffic:enabled",
        "height": fahrzeug.Height + "m",
        "width": fahrzeug.Width + "m",
        "length": fahrzeug.Length + "m",
        "limitedWeight": fahrzeug.MaxAllWeigth+"t",
        "axleCount": fahrzeug.AxlesCount,
        "maxSpeed": fahrzeug.MaxAllSpeed,
        "waypoint0": routingdata.origin.lat+","+routingdata.origin.lng,
        "waypoint1": routingdata.destination.lat+","+routingdata.destination.lng,
        "departure": routingdata.departureTime,
        
        "apiKey": "Is-9tu_HmtJnc-hoBx5MAPXTE7vjRKZGbtKMjO56Kwk"
  }; 

  if (addParameter == "yes"){
        HereTelematicsParameter = { ...HereTelematicsParameter, ...
            { 
                "speedFcCat" : fahrzeug.speedFcCat,
                "algopts": fahrzeug.algopts
            } 
        }
  } 

  var queryString = new URLSearchParams(HereTelematicsParameter).toString();
  if (addParameter != "" && addParameter != "yes")
        queryString+=addParameter;
  
  var apicall = url+"?"+queryString;
  const response = await fetch(apicall, {method: 'GET',redirect: 'follow'});
  const obj = await response.json();
    if(!response.ok) return (null);
  return(obj.response.route[0]) ;
}; 


async function loadPTV(origin, destination, reftime, addparam=""){

  const api_key="RVVfOGY4ZDZiZmFjMGY3NDYzMjk4MjI0MWUyOGRhY2U0YzQ6YzIzNjAyNmMtOWVlMC00MTA4LWE5NzEtZjc1YTMxNzZiNjFi";
  const params = {method: "GET", headers: {"ApiKey": api_key,"Content-Type": "application/json"}}
  const truckparam="&profile=EUR_TRUCK_11_99T&results=POLYLINE";
  const url = "https://api.myptv.com/routing/v1/routes?";
  const origin_str = origin.lat + "," + origin.lng;
  const dest_str = destination.lat + "," + destination.lng;
  var apicall = url+ "waypoints=" + origin_str +"&waypoints=" + dest_str + "&options[startTime]="+reftime+truckparam;
  const response = await fetch(apicall, {
    method: "GET",
    headers: {
        "ApiKey": 'RVVfOGY4ZDZiZmFjMGY3NDYzMjk4MjI0MWUyOGRhY2U0YzQ6YzIzNjAyNmMtOWVlMC00MTA4LWE5NzEtZjc1YTMxNzZiNjFi',
        "Content-Type": "application/json"
    }
});
  const obj = await response.json();
  if(!response.ok) return (null);
  return(obj) ;
}; 


function SwitchView(id){
  if (routingdata.polylines[id] !=0)
  {
    routingdata.polylines[id].setVisibility(!routingdata.polylines[id].getVisibility());
  }
}

function recalc(){
  routes.removeObject(routingdata.polylines[1]);
  routingdata.addParam=document.getElementById('addParams').value;
  loadHereFleetNew(routingdata.addParam).then((ergebnis) => show(ergebnis, 'green',1));
} 

function einblenden(){
  if (document.getElementById('ErweiterteEinstellungen').style.display == 'block')
    document.getElementById('ErweiterteEinstellungen').style.display = 'none'
  else
    document.getElementById('ErweiterteEinstellungen').style.display = 'block';
} 
