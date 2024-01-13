var routes = new H.map.Group();

var urlParams = new URLSearchParams(window.location.search);

var routingdata = {
  isbt_laenge: urlParams.get('isbt_l'),
  isbt_dauer: urlParams.get('isbt_d'),
  origin: {lat: urlParams.get('Origin').split(",")[0], lng: urlParams.get('Origin').split(",")[1]},
  destination: {lat: urlParams.get('Dest').split(",")[0], lng: urlParams.get('Dest').split(",")[1]},
  departureTime: urlParams.get('Departuretime'),
  result:[{ duration: 0.0, length: 0.0},{ duration: 0.0, length: 0.0},{ duration: 0.0, length: 0.0},{ duration: 0.0, length: 0.0}],
  polylines:[ null, null, null, null ],
  addParam: '&algopts=truckIntersectionDelaySpeedCat5MSec:1000&speedFcCat=80,80,80,80,70,56,35,10;80,80,80,75,65,49,35,10;80,80,74,70,60,48,35,10;60,60,60,60,57,40,30,10;50,48,46,42,39,22,19,10;,,,,,,,'
};

var Duration = "0,0 h"
var Laenge = "0,0 km"

// set up containers for the map  + panel
var mapContainer = document.getElementById('map');
var platform = new H.service.Platform({apikey: 'Is-9tu_HmtJnc-hoBx5MAPXTE7vjRKZGbtKMjO56Kwk'});
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

loadHereFleet(routingdata.origin, routingdata.destination, routingdata.departureTime, routingdata.addParam).then((ergebnis) => show(ergebnis, 'green',1));
loadHereFleet(routingdata.origin, routingdata.destination, routingdata.departureTime).then((ergebnis) => show(ergebnis, 'red',2));
loadPTV(routingdata.origin, routingdata.destination, routingdata.departureTime).then((ergebnis) => showPTV(ergebnis, 'yellow',3));
calculateRoutes (platform);

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
  const polyline = new H.map.Polyline(linestring,{ style: { lineWidth: 6, strokeColor: colour, lineDash: [1, 3], lineDashOffset: pos*2, lineTailCap: 'arrow-tail', lineHeadCap: 'arrow-head' }});
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
  const polyline = new H.map.Polyline(linestring,{ style: { lineWidth: 6, strokeColor: colour, lineDash: [1, 3], lineDashOffset: pos*2, lineTailCap: 'arrow-tail', lineHeadCap: 'arrow-head' }});
  // Add Line to Map
  routes.addObject(polyline);
 setZoom();
  routingdata.polylines[pos]=polyline;
}


function drawMarker(coord, text)
{
  const myMarker = new H.map.Marker(coord);
  myMarker.setData(text + "<br>Latitude: " + coord.lat + "<br>Longitude: " + coord.lng) ;
  routes.addObject(myMarker); 
  
}


function calculateRoutes(platform) {

  var router = platform.getRoutingService(null, 8);
  
  var routeParam = {
    routingMode: 'fast',
    transportMode: 'truck',
    return: 'polyline,travelSummary',
    units: 'metric',
    spans: 'truckAttributes',
    origin: routingdata.origin.lat + "," + routingdata.origin.lng, 
    destination: routingdata.destination.lat + "," + routingdata.destination.lng,
    departureTime: routingdata.departureTime,
    'vehicle[height]': 380,
    'vehicle[grossWeight]': 11000
  }
  
  calculateRoute(router, routeParam, {
    strokeColor: 'blue',
    lineWidth: 5, lineDash: [1, 3], lineDashOffset: 0
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
  document.getElementById('DauerISBT').textContent=minutes2HHMMSS(routingdata.isbt_dauer.replace(',', '.');
  document.getElementById('Dauer1').textContent=minutes2HHMMSS(routingdata.result[0].duration);
  document.getElementById('Dauer2').textContent=minutes2HHMMSS(routingdata.result[2].duration);
  document.getElementById('Dauer3').textContent=minutes2HHMMSS(routingdata.result[1].duration);
  document.getElementById('Dauer4').textContent=minutes2HHMMSS(routingdata.result[3].duration);
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

async function loadHereFleet(origin, destination, reftime, addparam=""){

  const truckparam="&height=3.8&limitedWeight=11t";
  const url = "https://fleet.ls.hereapi.com/2/calculateroute.json";
  const origin_str = origin.lat + "," + origin.lng;
  const dest_str = destination.lat + "," + destination.lng;
  //const apiKey="gET017F3PS1alYkXek5T9nAaTOXycH6bKRzcrOG_6eE";
  const apiKey="Is-9tu_HmtJnc-hoBx5MAPXTE7vjRKZGbtKMjO56Kwk";
  var apicall = url+"?apiKey="+apiKey+"&mode=fastest;truck;traffic:enabled&waypoint0=" + origin_str +"&waypoint1=" + dest_str + "&departureTime="+reftime;
  apicall+=truckparam;
  if (addparam!=""){
    apicall+=addparam;
  }
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
  loadHereFleet(routingdata.origin, routingdata.destination, routingdata.departureTime, routingdata.addParam).then((ergebnis) => show(ergebnis, 'green',1));
} 

function einblenden(){
  if (document.getElementById('ErweiterteEinstellungen').style.display == 'block')
    document.getElementById('ErweiterteEinstellungen').style.display = 'none'
  else
    document.getElementById('ErweiterteEinstellungen').style.display = 'block';
} 
