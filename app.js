import { mainQuestions, helperQuestions } from "./questions.js";

//LEAFLET MAP----------------------------------------------------
const coordBudapest = [47.499, 19.044]; //initial center
//const coordMoscow = [55.75, 37.62];
const spanZoomLevel = document.querySelector("#zoomLevel");
const initialZoomLevel = parseInt(spanZoomLevel.textContent); //intital zoom level

//CREATING MAP
const map = L.map("map", {
  zoomControl: true,
  minZoom: 1,
  maxZoom: 18,
}).setView([46.80, 17.45], initialZoomLevel); //setView (lon,lat, zoom level)

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
//LEAFLET MAP----------------------------------------------------

//NON-MAP--------------------------------------------------------

//SHOW CURRENT ZOOM LEVEL
map.on("zoomend", () => {
  spanZoomLevel.textContent = map.getZoom();
});

//MOUSE COORDINATES++++++++++++++
//CALCULATE MOUSE COORDINATES ON MOUSEMOVE
const showMouseCoordinatesLat = document.querySelector("#divMouseCoordLat");
const showMouseCoordinatesLng = document.querySelector("#divMouseCoordLng");
map.addEventListener("mousemove", function (e) {
  let mouseLatCoord = e.latlng.lat;
  let mouseLngCoord = e.latlng.lng;
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
//MOUSE COORDINATES++++++++++++++

//FLAG FOR BUDAPEST LOCATION
const flagIcon = L.icon({
  iconUrl: "./img/icon/flagpole.svg",
  iconSize: [32, 38], // size of the icon
  iconAnchor: [10, 38], // fele, mint az ikon meret, lefele meg a magassag
});

let marker1 = L.marker(coordBudapest, { icon: flagIcon });
marker1.addTo(map);

//DIV SLIDE IN-OUT
const slideDiv = document.querySelector("#slideDiv");
const slideDivFrontSide=slideDiv.querySelector('#slideDiv-frontSide');
const slideDivBackSide=slideDiv.querySelector('#slideDiv-backSide');
const slideDivFrontSideClickableEdge=slideDiv.querySelector('#slideDiv-frontSide-clickableEdge');
const slideDivFrontSideImage=slideDiv.querySelector('#slideDiv-frontSide-image');
let isFlippingAllowed=false;//answering helper question will unlock this

slideDivFrontSideClickableEdge.addEventListener('click',(e)=>{
  slideDiv.classList.toggle('slideInOut')
});
slideDivFrontSideImage.addEventListener('click',(e)=>{
  if(isFlippingAllowed){
    slideDivFrontSide.style.transform='perspective(600px) rotateY(-180deg)';
    slideDivBackSide.style.transform='perspective(600px) rotateY(0deg)';
  }

});
slideDivBackSide.addEventListener('click',(e)=>{
  slideDivFrontSide.style.transform='perspective(600px) rotateY(0deg)';
  slideDivBackSide.style.transform='perspective(600px) rotateY(180deg)';
});




//GAME LOGIC
let counterMainQuestion=1;//TRACKING THE MAIN TASKS

//ADDING QUESTION AND ADDL HELP TO SLIDING DIV
const slideDivHeaderH2=slideDiv.querySelector('#slideDivHeaderH2');//Main question title
const slideDivHeaderP=slideDiv.querySelector('#slideDivHeaderP');//main question addl info
const tippP=slideDiv.querySelector('#tippP');//main question extended info. It is unlocked only if the helper question is solved! Located on the backside of the sliding div.
slideDivHeaderH2.textContent=mainQuestions[counterMainQuestion].task;//assigning question from question.js file
slideDivHeaderP.textContent=mainQuestions[counterMainQuestion].taskText;//assigning question from question.js file
tippP.textContent=mainQuestions[counterMainQuestion].tipp;//this is on the backside; assigning question from question.js file

//ADDING IMAGE TO MAP DIV -THE MAIN TASK IS TO FIND THIS 
let pictureSource = mainQuestions[counterMainQuestion].imgSrc;
let pictureBounds= mainQuestions[counterMainQuestion].imgBounds;
let pictureLayer = L.imageOverlay(pictureSource, pictureBounds, {
  opacity: 1,
  interactive: true,
});
//ADDING PICTURE TO THE SLIDING DIV
const mainPicture=document.querySelector('#mainPicture');
mainPicture.src=pictureSource
//SET UP ZOOM DEPENDING PICTURE VISIBILITY
map.on("zoomend", function () {
  if (map.getZoom() > 13) {//the image will be visible only above zomm level #13
    pictureLayer.addTo(map);
  } else {
    pictureLayer.remove(map);
  }
});

//ADDING HELPER QUESTION (if solved, it unlocks the backside of the sliding div with more information)
const helperDropdown=document.querySelector('#helperDropdown');
const helperQuestionLabel=document.querySelector('#helperQuestionLabel');
const option1=document.querySelector('#option1');//dropdown option: value comes from questions.js /helperQuestions
const option2=document.querySelector('#option2');
const option3=document.querySelector('#option3');
const teaserVideo=document.querySelector('#teaserVideo');
const selectionFeedbackIcon=document.querySelector('#selectionFeedbackIcon');//little green icon appears if the helper answer is correct

function RandomGenerator(minNbr, maxNbr){//generate random number; use to select random helper question
  return Math.floor(Math.random()*(maxNbr-minNbr+1))+minNbr
};

let randomHelperQuestion=RandomGenerator(0,helperQuestions.length);//generating random number to select one helper question

helperQuestionLabel.textContent=helperQuestions[randomHelperQuestion].question;//assigning helper question 
option1.value=helperQuestions[randomHelperQuestion].answ1;//assigning helper question dropdown answer
option2.value=helperQuestions[randomHelperQuestion].answ2;//assigning helper question dropdown answer
option3.value=helperQuestions[randomHelperQuestion].answ3;//assigning helper question dropdown answer
option1.textContent=helperQuestions[randomHelperQuestion].answ1;//assigning helper question dropdown answer
option2.textContent=helperQuestions[randomHelperQuestion].answ2;//assigning helper question dropdown answer
option3.textContent=helperQuestions[randomHelperQuestion].answ3;//assigning helper question dropdown answer
let correctHelperAnswer=helperQuestions[randomHelperQuestion].answCorr;//the user`s selection will be matched to this value
teaserVideo.src=mainQuestions[1].videoSrc;

helperDropdown.addEventListener('change', ()=>{
  if(helperDropdown.value===correctHelperAnswer){
    isFlippingAllowed=true;
    selectionFeedbackIcon.style.visibility='visible'}
    else{
      isFlippingAllowed=false;
      selectionFeedbackIcon.style.visibility='hidden'
    }
})


pictureLayer.on("click", () => {
  alert("Moszkva, Voros Ter");//
});
