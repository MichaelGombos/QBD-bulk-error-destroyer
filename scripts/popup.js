console.log("The popup has been summoned mwahahahah!")

const runLimitInput = document.querySelector("#runLimit")
const delayInput = document.querySelector("#runDelay")
const startButton = document.querySelector("#start-btn")
const stopButton = document.querySelector("#stop-btn")
const resetButton = document.querySelector("#reset-btn")
const logButton = document.querySelector("#log-btn")
const currentStepText = document.querySelector("#currentStep")


let menuRunning = localStorage.getItem("menuRunning") ? JSON.parse(localStorage.getItem("menuRunning")) : false;
let menuCurrentStep = localStorage.getItem("menuCurrentStep") ? JSON.parse(localStorage.getItem("menuCurrentStep")) : 0;
let menuRunLimit = localStorage.getItem("menuRunLimit") ? JSON.parse(localStorage.getItem("menuRunLimit")) : 0;
let menuDelay = localStorage.getItem("menuDelay") ? JSON.parse(localStorage.getItem("menuDelay")) : 50;

runLimitInput.placeholder = menuRunLimit;
delayInput.placeholder = menuDelay

const updateRunButtonVisibility = (isRunning) => {
  if(isRunning){
    startButton.classList.add("hidden")
    stopButton.classList.remove("hidden")
  }
  else{
    startButton.classList.remove("hidden")
    stopButton.classList.add("hidden")
  }
}
updateRunButtonVisibility();

const updateCurrentStepText = () => {
  currentStepText.innerText = `Current step : ${menuCurrentStep}/${menuRunLimit}`
}
updateCurrentStepText();

const sendMessageToContentScript = (type, value ) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Send a message to the content script in the active tab
    chrome.tabs.sendMessage(tabs[0].id, {type, value});
});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.popupRequestType === "updateRuncount"){
    console.log("THIS MESSAGE WAS RECEIVED IN THE POPUP" , request.data);

    menuCurrentStep = request.data.newValue;
    localStorage.setItem("menuCurrentStep", request.data.newValue)
    menuRunLimit = request.data.limit;
    localStorage.setItem("menuRunLimit", menuRunLimit)

    updateCurrentStepText();
    sendResponse({farewell: "popup farewell (update runcount)"});
    }
    else if (request.popupRequestType === "updateRunning"){

    menuRunning = request.data.isRunning;
    localStorage.setItem("menuRunning", menuRunning)
      //depending on running value, hide a button
    updateRunButtonVisibility();
    sendResponse({farewell: "popup farewell (update running)"});
    }
  }
);

// chrome.extension.onConnect.addListener(function (port) {
//   if (port.name === "popup") {
//     // The popup window is open
//     console.log("Popup window is open");
//     // Perform any actions you want when the popup window is open

//     port.onDisconnect.addListener(function () {
//       // The popup window is closed
//       console.log("Popup window is closed");
//       // Perform any actions you want when the popup window is closed
//     });
//   }
// });

delayInput.addEventListener("change", () => {
  console.log("input yep")
  sendMessageToContentScript("delay",delayInput.value)
} )
runLimitInput.addEventListener("change", () => {
  console.log("input yep")
  sendMessageToContentScript("runLimit",runLimitInput.value)

  menuRunLimit = runLimitInput.value;
  localStorage.setItem("menuRunLimit", runLimitInput.value)
  updateCurrentStepText();
} )
startButton.addEventListener("click", () => {
  console.log("start no way..")
  sendMessageToContentScript("start")
  startButton.classList.add("hidden")
  stopButton.classList.remove("hidden")
})
stopButton.addEventListener("click", () => {
  console.log("stop no way..")
  sendMessageToContentScript("stop")
  stopButton.classList.add("hidden")
  startButton.classList.remove("hidden")
})
resetButton.addEventListener("click", () => {
  console.log("no way..")
  sendMessageToContentScript("reset")
  updateRunButtonVisibility(false)
  menuCurrentStep = 0;
  localStorage.setItem("menuCurrentStep",0)
  updateCurrentStepText();
})

logButton.addEventListener("click", () => {
  console.log("no way..")
  sendMessageToContentScript("log")
})