import { mainQuestions, miniQuestions } from "./questions.js";

//LEAFLET MAP----------------------------------------------------
const coordBudapest = [47.499, 19.044]; //initial center
const coordMoscow = [55.75, 37.62];
const spanZoomLevel = document.querySelector("#zoomLevel");
const initialZoomLevel = parseInt(spanZoomLevel.textContent); //intital zoom level

//CREATING MAP
const map = L.map("map", {
  zoomControl: true,
  minZoom: 1,
  maxZoom: 18,
}).setView(coordMoscow, initialZoomLevel); //setView (lon,lat, zoom level)

// TRICK: RESISTING BEING DRAGGED OUT OF BOUNDS
const southWest = L.latLng(-89.98155760646617, -180);
const northEast = L.latLng(89.99346179538875, 180);
const bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);
map.on("drag", function () {
  map.panInsideBounds(bounds, { animate: false });
});

//MAP URLS + TILE LAYERS
const muholdkepUrl =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const fekete_feherUrl =
  "https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png";
const pasztelUrl =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
const domborzatiUrl =
  "https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=zOtHmP9eQCFPL7U1D2W0";

const pasztel = L.tileLayer(pasztelUrl, {
  attribution: "",
  noWrap: true,
});
const fekete_feher = L.tileLayer(fekete_feherUrl, {
  attribution: "",
  noWrap: true,
});
const domborzati = L.tileLayer(domborzatiUrl, {
  attribution: "",
  noWrap: true,
});
const muholdkep = L.tileLayer(muholdkepUrl, { attribution: "", noWrap: true });

//ADDING STARTING BASELAYER TO MAP
pasztel.addTo(map);

//ADDING LAYER SELECTION BUTTON
const layerOptions = L.control.layers({
  pasztel: pasztel,
  "fekete-feher": fekete_feher,
  domborzati: domborzati,
  muholdkep: muholdkep,
});
layerOptions.addTo(map);

//SHOW SCALE (metrics only)
L.control.scale({ imperial: false }).addTo(map);

//SHOW CURRENT ZOOM LEVEL
map.on("zoomend", () => {
  spanZoomLevel.textContent = map.getZoom();
});

//CALCULATE MOUSE COORDINATES ON MOUSEMOVE
const showMouseCoordinatesLat = document.querySelector("#divMouseCoordLat");
const showMouseCoordinatesLng = document.querySelector("#divMouseCoordLng");
map.addEventListener("mousemove", function (ev) {
  let mouseLatCoord = ev.latlng.lat;
  let mouseLngCoord = ev.latlng.lng;
  //SHOW COORDINATES ONLY INSIDE BOUNDS
  if (Math.abs(mouseLatCoord) < 85 && Math.abs(mouseLngCoord) < 180) {
    showMouseCoordinatesLat.textContent = `${mouseLatCoord.toFixed(2)}°`;
    showMouseCoordinatesLng.textContent = `${mouseLngCoord.toFixed(2)}°`;
  } else {
    showMouseCoordinatesLat.textContent = "";
    showMouseCoordinatesLng.textContent = "";
  }
});
//DISPLAY MOUSE COORDINATES NEXT TO MOVING MOUSE
document.addEventListener("mousemove", (e) => {
  if (e.target.id === "map") {
    let x = e.clientX; //mouse position X
    let y = e.clientY; //mouse position Y
    showMouseCoordinatesLat.style.left = x + 30 + "px";
    showMouseCoordinatesLat.style.top = y - 10 + "px";
    showMouseCoordinatesLng.style.left = x + 30 + "px";
    showMouseCoordinatesLng.style.top = y + 10 + "px";
  } else {
    showMouseCoordinatesLat.textContent = "";
    showMouseCoordinatesLng.textContent = "";
  }
});

//FLAG FOR BUDAPEST LOCATION
const flagIcon = L.icon({
  iconUrl: "./img/icon/flagpole.svg",
  iconSize: [32, 38], // size of the icon
  iconAnchor: [10, 38], // fele, mint az ikon meret, lefele meg a magassag
});

let marker1 = L.marker(coordBudapest, { icon: flagIcon });
marker1.addTo(map);

//DIV SLIDE IN-OUT
const slideDiv = document.querySelector(".slideDiv");
slideDiv.addEventListener("click", (e) => {
  let slideDivLeftMarginValue = window.getComputedStyle(slideDiv).marginLeft;
  if (slideDivLeftMarginValue === "-200px") {
    slideDiv.style.marginLeft = "50px";
  } else {
    slideDiv.style.marginLeft = "-200px";
  }
});

//FLIPPING IMAGE CLICK
let flipAllowed = false;
let isFlipped=false
const flippingCardFrame = document.querySelector("#flippingCardFrame");
const flippingCardFront = document.querySelector("#flippingCardFront");
const flippingCardBack = document.querySelector("#flippingCardBack");

flippingCardFrame.addEventListener("click", (e) => {
  if (flipAllowed) {
    if(!isFlipped){
      flippingCardFront.style.transform = "perspective(600px) rotateY(-180deg)";
      flippingCardBack.style.transform = "perspective(600px) rotateY(0deg)";
    }else{
      flippingCardFront.style.transform = "perspective(600px) rotateY(0deg)";
      flippingCardBack.style.transform = "perspective(600px) rotateY(180deg)";
    }
    isFlipped=!isFlipped;
  }
});

//GAME LOGIC
let currentMain=0;//TRACKING THE MAIN TASKS

//ADDING QUESTION AND ADDL HELP TO SLIDING DIV
const slideDivHeaderH2=slideDiv.querySelector('#slideDivHeaderH2');
const slideDivHeaderP=slideDiv.querySelector('#slideDivHeaderP');
const tippP=slideDiv.querySelector('#tippP');
slideDivHeaderH2.textContent=mainQuestions[currentMain].task;
slideDivHeaderP.textContent=mainQuestions[currentMain].taskText;
tippP.textContent=mainQuestions[currentMain].tipp;
//ADDING IMAGE TO SLIDING DIV
let pictureSource = mainQuestions[currentMain].imgSrc;
let pictureBounds= mainQuestions[currentMain].imgBounds;

let pictureLayer = L.imageOverlay(pictureSource, pictureBounds, {
  opacity: 1,
  interactive: true,
});
//SET UP ZOOM DEPENDING PICTURE VISIBILITY
map.on("zoomend", function () {
  if (map.getZoom() > 13) {//the image will be visible only above zomm level #13
    pictureLayer.addTo(map);
  } else {
    pictureLayer.remove(map);
  }
});
//ADDING MINI QUESTION

function RandomGenerator(minNbr, maxNbr){//min=0,max=miniQuestions.length included
  return Math.floor(Math.random()*(maxNbr-minNbr+1))+minNbr
}
let currentMini=RandomGenerator(0,miniQuestions.length)
const dropdown=document.querySelector('#dropdown');
const miniQuestionLabel=document.querySelector('#miniQuestionLabel');
const opt1=document.querySelector('#opt1');
const opt2=document.querySelector('#opt2');
const opt3=document.querySelector('#opt3');
let correctMiniAnswer;
console.log(currentMini)
miniQuestionLabel.textContent=miniQuestions[currentMini].question;
opt1.value=miniQuestions[currentMini].answ1;
opt2.value=miniQuestions[currentMini].answ2;
opt3.value=miniQuestions[currentMini].answ3;
opt1.textContent=miniQuestions[currentMini].answ1;
opt2.textContent=miniQuestions[currentMini].answ2;
opt3.textContent=miniQuestions[currentMini].answ3;
correctMiniAnswer=miniQuestions[currentMini].answCorr;
dropdown.addEventListener('change', ()=>{
  console.log(dropdown.value)
  if(dropdown.value===correctMiniAnswer){
    console.log('kitalaltad!!!');
    flipAllowed=true;}
})


pictureLayer.on("click", () => {
  alert("Moszkva, Voros Ter");
});
