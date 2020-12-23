import { mainQuestions, helperQuestions } from "./questions.js"; //all the puzzles are in a separate file

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++LEAFLET MAP STARTS HERE++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

//LEAFLET RELATED VARIABLES
const coordBudapest = [47.499, 19.044]; //initial center of the map
const initialZoomLevel = 15; //intital zoom level of the map
const showMouseCoordinatesLat = document.querySelector("#divMouseCoordLat"); //div to show mouse coordinate -Latitude
const showMouseCoordinatesLng = document.querySelector("#divMouseCoordLng"); //div to show mouse coordinate -Longitude
const spanZoomLevel = document.querySelector("#zoomLevel"); //this divs shows the current zoom level on the top of the map

//CREATING A LEAFLET MAP
const map = L.map("map", {
  zoomControl: true,
  minZoom: 1,
  maxZoom: 18,
}).setView(coordBudapest, initialZoomLevel); //setView() syntax:(longitude,latitude, map zoom level)

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

const pasztel = L.tileLayer(pasztelUrl, { attribution: "", noWrap: true });
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

//SHOWING THE ZOOM LEVEL ON TOP OF THE MAP IN THE BEGINNING
spanZoomLevel.textContent = initialZoomLevel; //for start it shows the setting; later on it will show the current value as the user changes it
//SHOWING THE ZOOM LEVEL ON TOP OF THE MAP AS THE GAME PROGRESS
map.on("zoomend", () => {
  spanZoomLevel.textContent = map.getZoom();
});

/*MOUSE COORDINATES NEXT TO MOUSE------------------------
calculating mouse coordinates over the map*/
map.addEventListener("mousemove", function (e) {
  let mouseLatCoord = e.latlng.lat;
  let mouseLngCoord = e.latlng.lng;
  //show mouse coordinates only inside bounds: if the zoom level of the map is slow, the map will not fill the whole screen; no coordinate will appear where there is no map
  if (Math.abs(mouseLatCoord) < 85 && Math.abs(mouseLngCoord) < 180) {
    showMouseCoordinatesLat.textContent = `${mouseLatCoord.toFixed(2)}°`;
    showMouseCoordinatesLng.textContent = `${mouseLngCoord.toFixed(2)}°`;
  } else {
    showMouseCoordinatesLat.textContent = "";
    showMouseCoordinatesLng.textContent = "";
  }
});
//displaying mouse coordinates next to the moving mouse
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
//MOUSE COORDINATES ENDS----------------------------------

//FLAG: BUDAPEST LOCATION
const flagIcon = L.icon({
  iconUrl: "./img/icon/flagpole.svg",
  iconSize: [32, 38], // size of the icon
  iconAnchor: [10, 38], // fele, mint az ikon meret, lefele meg a magassag
});
let marker1 = L.marker(coordBudapest, { icon: flagIcon });
marker1.addTo(map);


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
++++++++++++++++GAME LOGIC STARTS HERE+++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

//DEFINING VARIABLES + SELECTING DOM ELEMENTS--------------------------------------------------
const slideDiv = document.querySelector("#slideDiv"); //siliding card
const slideDivFrontSide = slideDiv.querySelector("#slideDiv-frontSide"); //sliding card front side; it is not visible, if the card is out of the screen or the card is flipped
const slideDivBackSide = slideDiv.querySelector("#slideDiv-backSide"); //sliding card back side; visible only if the helper question is solved (selecting the right answer from the dropdown list); then the user can click on the image on the card and the card flips 180deg.
const slideDivFrontSideClickableEdge = slideDiv.querySelector(
  "#slideDiv-frontSide-clickableEdge"
); //the vertical right margin of the sliding card. Clicking on it will move the card into the center fo the sreen or move it out so the user can use the map below it.
const slideDivFrontSideImage = slideDiv.querySelector(
  "#slideDiv-frontSide-image"
); //this is the image on the front side of the card. The user has to locate this image on the map;
const slideDivHeaderH2 = slideDiv.querySelector("#slideDivHeaderH2"); //Main question title on the sliding card
const slideDivHeaderP = slideDiv.querySelector("#slideDivHeaderP"); //main question addl info on the sliding card, below the title
const backSideTippP = slideDiv.querySelector("#backSideTippP"); //main question extended info. It is unlocked only if the helper question is solved! Located on the backside of the sliding card.
const helperDropdown = slideDiv.querySelector("#helperDropdown"); //this is the dropdown list with all the possible answers for the helper question.
const helperQuestionLabel = slideDiv.querySelector("#helperQuestionLabel"); //the actual question for the dropdown list
const option1 = slideDiv.querySelector("#option1"); //dropdown option: value comes from questions.js /helperQuestions
const option2 = slideDiv.querySelector("#option2");
const option3 = slideDiv.querySelector("#option3");
const teaserVideo = slideDiv.querySelector("#teaserVideo"); //video embedded into the text on the backside of the sliding card
const selectionFeedbackIcon = slideDiv.querySelector("#selectionFeedbackIcon"); //little green icon appears only if the dropdown selection is correct
const mainPicture = slideDiv.querySelector("#mainPicture"); //this is the image on the sliding card. With it I can show to the user what to look for on the map. The users job is to locate the copy of this image hidden somewhere on the map
const mainPictureSolvedOverlay = slideDiv.querySelector(
  "#mainPictureSolvedOverlay"
); //green icon appears on the image of the sliding card to indicate that the puzzle is already solved

let pictureLayer = "";
let correctHelperAnswer;
let counterMainQuestion = 0; //Counter for tracking the main puzzle; data is imported from questions.js
let isFlippingUnlocked = false; //answering helper question will unlock this
let isTargetAddedToMap = false;
let isThisTheFirstRoundInTheGame = true;
const zoomTresholdForTargetImage = 4;
//DEFINING VARIABLES + SELECTING DOM ELEMENTS ENDS-------------------------------------------

//FN:TO SLIDE IN-OUT CARD-------------------------------
const slidingInAndOut = () => {
  slideDiv.classList.toggle("slideInOut");
};
//FN:TO SLIDE ENDS--------------------------------------

/*FN: RANDOM NUMBER GENERATOR---------------------
random number to use to select helper question; helper question is a dropdown list below the main image; answering it correctly will unlock the possibility to flip the card and reveal the information on the back side*/
const RandomGenerator = (minNbr, maxNbr) => {
  return Math.floor(Math.random() * (maxNbr - minNbr + 1)) + minNbr;
};
//FN: RANDOM NUMBER GENERATOR ENDS-----------------

/*FN: HELPER QUESTION------------------------------
selecting the right answer from the dropdown list will unlock the backside of the slindig card. The user needs to click on the image of the card, and it will flip to reveal additional information*/
const helperQuestionLoading = () => {
  //re-set previous values (if exist)
  helperDropdown.value = ""; //whenever this function runs, always set up dropdown list to this text: '-- válassz! --'
  selectionFeedbackIcon.style.visibility = "hidden"; //if new helperfunction comes up, this icon definiately should be hidden
  //generating random number to select a helper question
  let randomHelperQuestion = RandomGenerator(0, helperQuestions.length);
  //assigning values to dropdown list
  helperQuestionLabel.textContent =
    helperQuestions[randomHelperQuestion].question; //assigning helper question from questions.js via import
  option1.value = helperQuestions[randomHelperQuestion].answ1; //assigning helper question dropdown answer from questions.js via import
  option2.value = helperQuestions[randomHelperQuestion].answ2; //assigning helper question dropdown answer from questions.js via import
  option3.value = helperQuestions[randomHelperQuestion].answ3; //assigning helper question dropdown answer from questions.js via import
  option1.textContent = helperQuestions[randomHelperQuestion].answ1; //assigning helper question dropdown answer from questions.js via import
  option2.textContent = helperQuestions[randomHelperQuestion].answ2; //assigning helper question dropdown answer from questions.js via import
  option3.textContent = helperQuestions[randomHelperQuestion].answ3; //assigning helper question dropdown answer from questions.js via import
  correctHelperAnswer = helperQuestions[randomHelperQuestion].answCorr; //the user`s selection will be matched to this value
  console.log(`helper question index: ${randomHelperQuestion}`);
};
//FN: HELPER QUESTION ENDS---------------------------

/*FN: LOADING A NEW PUZZLE-----------------------------------------
please note: there are two images in this code: one is hidden on the map; the task is to find this image and click on it. The other one is the image on the sliding div to show the user what to look for on the map*/
const newPuzzleLoading = () => {
  if (pictureLayer) {
    //the previous target image is removed (if exists)
    pictureLayer.remove(map);
  }

  if (mainQuestions[counterMainQuestion].solved) {
    //if the user already solved this puzzle, the green check icon appears over the image indicating that the main task is already solved
    mainPictureSolvedOverlay.style.visibility = "visible"; //icon appears
  } else {
    mainPictureSolvedOverlay.style.visibility = "hidden"; //if the puzzle is not solved yet, the greed icon is not visible
  }
  helperQuestionLoading(); //helper questions at the bottom of the page. Answering that will unlock the option to flip the card and read more helping information.

  //FILL UP THE SLIDING DIV WITH THE CURRENT QUESTION (front and backside as well)
  slideDivHeaderH2.textContent = mainQuestions[counterMainQuestion].task; //assigning question from question.js file
  slideDivHeaderP.textContent = mainQuestions[counterMainQuestion].taskText; //assigning question from question.js file
  backSideTippP.textContent = mainQuestions[counterMainQuestion].tipp; //this is on the backside; assigning question from question.js file

  //ADDING IMAGE TO MAP -THE MAIN TASK IS TO LOCATE THIS PICTURE AND CLICK ON IT
  let pictureSource = mainQuestions[counterMainQuestion].imgSrc; //assigning the current target picture`s URL to a variable
  let pictureBounds = mainQuestions[counterMainQuestion].imgBounds; //assigning the current target picture`s location on map
  pictureLayer = L.imageOverlay(pictureSource, pictureBounds, {
    opacity: 1,
    interactive: true,
  });
  pictureLayer.addTo(map);
  isTargetAddedToMap === true;
  console.log(`initial image loading: ${pictureSource}`);

  //ADDING HERO PICTURE TO THE SLIDING DIV- this one shows the user what to look at the map. If the helper question is solved, by clicking on this image reveals the back side of the sliding card
  mainPicture.src = pictureSource;
  //ADDING VIDEO TO THE BACKSIDE OF THE SLIDING DIV
  teaserVideo.src = mainQuestions[counterMainQuestion].videoSrc;
};
//FN: LOADING A NEW PUZZLE ENDS-------------------------------------

/*ADDING OR REMOVING TARGET PICTURE FROM THE MAP, DEPENDING ON ZOOM LEVEL ---------
map.getZoom() gets the current zoom level*/
map.on("zoomend", function () {
  //when the zooming scroll finishes, check this:
  if (
    //if the current zoom level >= than the trehsold I set up earlier, and the image is not added yet, then...
    map.getZoom() >= zoomTresholdForTargetImage &&
    isTargetAddedToMap === false
  ) {
    pictureLayer.addTo(map); //the image is added to the map
    console.log("target image is added");
    isTargetAddedToMap = true; //track in a variable that the target picture is already on the map somewhere hidden

    pictureLayer.on("click", () => {
      //also add this logic: if image is found and clicked, the sliding div comes into the centre of the screen, and the green check icon appears on top of the image, indicating that the puzzle is solved
      slidingInAndOut();
      setTimeout(() => {
        mainPictureSolvedOverlay.style.visibility = "visible";
      }, 2000);
      mainQuestions[counterMainQuestion].solved = true; //the current puzzle is set to solved; if this is true, when the user with button clicks navigates himself again, a green icon will be visible on top of the main picture indicating that the puzzle is already solved
    });
  }
  if (
    //if the target image is visible, but the zoom level is set to smaller than the treshold, then...
    map.getZoom() < zoomTresholdForTargetImage &&
    isTargetAddedToMap === true
  ) {
    pictureLayer.off("click", () => {
      //remove event listener starts here; !!! LATER SIMPLIFY, because this part of the code is duplicated
      slidingInAndOut();
      setTimeout(() => {
        mainPictureSolvedOverlay.style.visibility = "visible";
      }, 2000);
      mainQuestions[counterMainQuestion].solved = true;
    }); //remove event listener ends here

    pictureLayer.remove(map); //the target image should be removed
    isTargetAddedToMap = false; //tracking that no image is added to the map currently
    console.log("target image is removed");
  }
});
//ADDING OR REMOVING TARGET PICTURE ENDS -------------------------------------------

/*ADDING HELPER QUESTION -----------------------
if the right option is selected from the dropdown list below the image, this unlocks the backside of the sliding div with additional information to help solving the main puzzle*/
helperDropdown.addEventListener("change", () => {
  //if there is a change on dropdown
  if (helperDropdown.value === correctHelperAnswer) {
    //if selection is correct
    isFlippingUnlocked = true;
    selectionFeedbackIcon.style.visibility = "visible"; //feedback that the answer was correct (little green icon appears)
  } else {
    isFlippingUnlocked = false;
    selectionFeedbackIcon.style.visibility = "hidden";
  }
});
//ADDING HELPER QUESTION ENDS -------------------

/*CAPTURING BUTTON CLICK FOR PAGING BACK OR FORWARD ----------------------------------
two buttons 'vissza' and 'tovabb' will load new tasks to solve by clicking on them*/
const pageingBtnDiv = slideDiv.querySelector("#pageingBtnDiv"); //parent div for 'vissza' and 'tovabb' buttons
pagingBtnDiv.addEventListener("click", (e) => {
  if (e.target.id === "btnGoBack") {
    //if possible, load the previous question. if you reached the very first one, load the last one, creating infinite loop
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
  newPuzzleLoading(); //new questions are loaded here. The very first question is loaded by clicking on the vertical edge of the sliding div
  map.setView(coordBudapest, initialZoomLevel);
});
//CAPTURING BUTTON CLICK ENDS ---------------------------------------------------------

/*CLICKING ON THE VERTIVAL MARGIN OF THE SLIDING DIV AT THE VERY BEGINNING OF THE GAME-----------------
the very first main puzzle is loaded by clicking on the visible vertical edge of the sliding card*/
slideDivFrontSideClickableEdge.addEventListener("click", (e) => {
  slidingInAndOut(); //move the card from the hidden position to the centre of the screen
  if (
    //if the sliding div is out of the screen and so far there was no previous round before, then...
    slideDiv.classList.contains("slideInOut") &&
    isThisTheFirstRoundInTheGame === true
  ) {
    newPuzzleLoading(); //start the game with the first main question (index 0)
    isThisTheFirstRoundInTheGame = false; //stop further question loading by clicking on the vertical edge of the sliding div. Further questions can be accessed thru button clicks on 'vissza' or 'tovabb'
  }
});
//CLICKING ON THE VERTIVAL MARGIN ENDS------------------------------------------------------------------

/*FLIPPING THE CARD STARTS ---------------------
if the flipping option is unlocked (= helper question below is solved), then clicking on the image the whole card will flip 180deg to reveal the back side and to show additional information for the user */
const slidingCardRotation = (frontRotationValue, backRotationValue) => {
  slideDivFrontSide.style.transform = `perspective(600px) rotateY(${frontRotationValue}deg)`;
  slideDivBackSide.style.transform = `perspective(600px) rotateY(${backRotationValue}deg)`;
};

slideDivFrontSideImage.addEventListener("click", (e) => {
  if (isFlippingUnlocked) {
    slidingCardRotation(-180, 0);
  }
});
slideDivBackSide.addEventListener("click", (e) => {
  slidingCardRotation(0, 180); //flips back the sliding card (no condition here, back side of the card is accessible only if the helper question was already solved before)
});
//FLIPPING THE CARD ENDS-----------------------
