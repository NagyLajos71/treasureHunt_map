import { mainQuestions, helperQuestions } from "./questions.js";

//LEAFLET MAP----------------------------------------------------
const coordBudapest = [47.499, 19.044]; //initial center
const ideiglenes = [27.80, 86.8];
let isTargetAddedToMap=false;
let isThisTheFirstRoundInTheGame=true;
const spanZoomLevel = document.querySelector("#zoomLevel");
const zoomTresholdForTargetImage=7;
const initialZoomLevel = 8;//parseInt(spanZoomLevel.textContent); //intital zoom level

//CREATING MAP
const map = L.map("map", {
  zoomControl: true,
  minZoom: 1,
  maxZoom: 18,
}).setView(ideiglenes, initialZoomLevel); //setView (lon,lat, zoom level)

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

//MAP ADDITIONAL-------------------------------------------------
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
//MAP ADDITIONAL-------------------------------------------------
//NON-MAP--------------------------------------------------------

//DIV SLIDE IN-OUT
const slideDiv = document.querySelector("#slideDiv");
const slideDivFrontSide = slideDiv.querySelector("#slideDiv-frontSide");
const slideDivBackSide = slideDiv.querySelector("#slideDiv-backSide");
const slideDivFrontSideClickableEdge = slideDiv.querySelector(
  "#slideDiv-frontSide-clickableEdge"
);
const slideDivFrontSideImage = slideDiv.querySelector(
  "#slideDiv-frontSide-image"
);
let isFlippingAllowed = false; //answering helper question will unlock this

function slidingInAndOut(){
  slideDiv.classList.toggle("slideInOut");
};
//GAME LOGIC--------------------------------------------------------

//ADDING QUESTION AND ADDL HELP TO SLIDING DIV
const slideDivHeaderH2 = slideDiv.querySelector("#slideDivHeaderH2"); //Main question title
const slideDivHeaderP = slideDiv.querySelector("#slideDivHeaderP"); //main question addl info
const tippP = slideDiv.querySelector("#tippP"); //main question extended info. It is unlocked only if the helper question is solved! Located on the backside of the sliding div.
const helperDropdown = slideDiv.querySelector("#helperDropdown");
const helperQuestionLabel = slideDiv.querySelector("#helperQuestionLabel");
const option1 = slideDiv.querySelector("#option1"); //dropdown option: value comes from questions.js /helperQuestions
const option2 = slideDiv.querySelector("#option2");
const option3 = slideDiv.querySelector("#option3");
const teaserVideo = slideDiv.querySelector("#teaserVideo");
const selectionFeedbackIcon = slideDiv.querySelector("#selectionFeedbackIcon"); //little green icon appears if the helper answer is correct
const mainPicture = slideDiv.querySelector("#mainPicture");
const mainPictureSolvedOverlay=slideDiv.querySelector('#mainPictureSolvedOverlay');
let pictureLayer='';
let correctHelperAnswer;

function RandomGenerator(minNbr, maxNbr) {
  //generate random number; use to select random helper question
  return Math.floor(Math.random() * (maxNbr - minNbr + 1)) + minNbr;
};


let counterMainQuestion = 0; //COUNTER-TRACKING THE MAIN QUESTIONS

function helperQuestionLoading(){
  helperDropdown.value='';//always set up dropdown list to this text: '-- válassz! --'
  selectionFeedbackIcon.style.visibility='hidden';//if new helperfunction comes up, this icon definiately should be hidden
  let randomHelperQuestion = RandomGenerator(0, helperQuestions.length); //generating random number to select a helper question
  helperQuestionLabel.textContent =helperQuestions[randomHelperQuestion].question; //assigning helper question
  option1.value = helperQuestions[randomHelperQuestion].answ1; //assigning helper question dropdown answer
  option2.value = helperQuestions[randomHelperQuestion].answ2; //assigning helper question dropdown answer
  option3.value = helperQuestions[randomHelperQuestion].answ3; //assigning helper question dropdown answer
  option1.textContent = helperQuestions[randomHelperQuestion].answ1; //assigning helper question dropdown answer
  option2.textContent = helperQuestions[randomHelperQuestion].answ2; //assigning helper question dropdown answer
  option3.textContent = helperQuestions[randomHelperQuestion].answ3; //assigning helper question dropdown answer
  correctHelperAnswer = helperQuestions[randomHelperQuestion].answCorr; //the user`s selection will be matched to this value
  console.log(`helper question index: ${randomHelperQuestion}`)
};

function gameLoading() {
  if(pictureLayer){
    pictureLayer.remove(map);
  };//the previous target image is removed (if exists)
  if(mainQuestions[counterMainQuestion].solved){
    mainPictureSolvedOverlay.style.visibility='visible';
  }else{
    mainPictureSolvedOverlay.style.visibility='hidden';
  }
  helperQuestionLoading();
  slideDivHeaderH2.textContent = mainQuestions[counterMainQuestion].task; //assigning question from question.js file
  slideDivHeaderP.textContent = mainQuestions[counterMainQuestion].taskText; //assigning question from question.js file
  tippP.textContent = mainQuestions[counterMainQuestion].tipp; //this is on the backside; assigning question from question.js file
  //ADDING IMAGE TO MAP DIV -THE MAIN TASK IS TO FIND THIS PICTURE
  let pictureSource = mainQuestions[counterMainQuestion].imgSrc;//assigning the current target picture`s URL to a variable
  let pictureBounds = mainQuestions[counterMainQuestion].imgBounds;//assigning the current target picture`s location on map
  pictureLayer = L.imageOverlay(pictureSource, pictureBounds, {
    opacity: 1,
    interactive: true,
  });
  //ADDING HERO PICTURE TO THE SLIDING DIV
  mainPicture.src = pictureSource;
  //ADDING VIDEO TO THE BACKSIDE OF THE SLIDING DIV
  teaserVideo.src = mainQuestions[counterMainQuestion].videoSrc;
}


//ADDING/REMOVING TARGET PICTURE DEPENDING ON ZOOM LEVEL (VISIBILITY)
map.on("zoomend", function () {
  if (map.getZoom() >= zoomTresholdForTargetImage && isTargetAddedToMap===false) {//if the current zoom level >= than... and the image is not added yet, then...
    isTargetAddedToMap=true;
    pictureLayer.addTo(map);//the image is added to the map
    pictureLayer.on("click", () => {
      alert("Megtalaltad! Gratulalok"); 
        slidingInAndOut();
        setTimeout(()=>{
          mainPictureSolvedOverlay.style.visibility='visible';
        },2000)
       

      mainQuestions[counterMainQuestion].solved=true;//the current task is set to solved

    });
  }
  if(map.getZoom() < zoomTresholdForTargetImage && isTargetAddedToMap===true) {//if the target image is visible, but the zoom level is set to smaller than the treshold, then...
    pictureLayer.remove(map);//the target image is removed
    isTargetAddedToMap=false;
  }
});

//ADDING HELPER QUESTION (if solved, it unlocks the backside of the sliding div with more information)
helperDropdown.addEventListener("change", () => {
  if (helperDropdown.value === correctHelperAnswer) {
    isFlippingAllowed = true;
    selectionFeedbackIcon.style.visibility = "visible";
  } else {
    isFlippingAllowed = false;
    selectionFeedbackIcon.style.visibility = "hidden";
  }
});

//CAPTURING BUTTON CLICK FOR PAGING BACK OR FORWARD
const pageingBtnDiv = slideDiv.querySelector("#pageingBtnDiv");
pagingBtnDiv.addEventListener("click", (e) => {
  if (e.target.id === "btnGoBack") {
    if (counterMainQuestion > 0) {
      counterMainQuestion--;
    } else {
      counterMainQuestion = mainQuestions.length - 1;
    }
  }
  if (e.target.id === "btnGoForward") {
    if (counterMainQuestion < mainQuestions.length - 1) {
      counterMainQuestion++;
    } else {
      counterMainQuestion = 0;
    }
  }
  gameLoading(); //new questions are loaded here. The very first question is loaded by clicking on the vertical edge of the sliding div
});

//the very first question is loaded by clicking on the vertical edge of the sliding card
slideDivFrontSideClickableEdge.addEventListener("click", (e) => {
  slidingInAndOut();//move the card inside the screen
  if(slideDiv.classList.contains('slideInOut') && isThisTheFirstRoundInTheGame===true){//if the sliding div is out of the screen and so far there was no previous round before, then...
    gameLoading();//start the game with the first question
    isThisTheFirstRoundInTheGame=false;//stop further question loading by clicking on the vertical edge of the sliding div. Further questions can be accessed thru paging button clicks
  }
  
});
//if flipping is allowed (helper question is solved) then on clicking flip the sliding card
slideDivFrontSideImage.addEventListener("click", (e) => {
  if (isFlippingAllowed) {
    slideDivFrontSide.style.transform = "perspective(600px) rotateY(-180deg)";
    slideDivBackSide.style.transform = "perspective(600px) rotateY(0deg)";
  }
});
slideDivBackSide.addEventListener("click", (e) => {//flip back the sliding card (no condition here, back side of the card is accessible only if the helper question was solved before)
  slideDivFrontSide.style.transform = "perspective(600px) rotateY(0deg)";
  slideDivBackSide.style.transform = "perspective(600px) rotateY(180deg)";
});

