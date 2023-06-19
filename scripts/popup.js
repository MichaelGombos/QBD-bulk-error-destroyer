console.log("The popup has been summoned mwahahahah!")

const runLimitInput = document.querySelector("#runLimit")
const delayInput = document.querySelector("#runDelay")
const startButton = document.querySelector("#start-btn")
const stopButton = document.querySelector("#stop-btn")
const resetButton = document.querySelector("#reset-btn")
const logButton = document.querySelector("#log-btn")
const currentStepText = document.querySelector("#currentStep")

let menuCurrentStep = localStorage.getItem("menuCurrentStep") ? JSON.parse(localStorage.getItem("menuCurrentStep")) : 0;
let menuRunLimit = localStorage.getItem("menuRunLimit") ? JSON.parse(localStorage.getItem("menuRunLimit")) : 0;

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
    localStorage.setItem("menuCurrentStep", menuCurrentStep)
    menuRunLimit = request.data.limit;
    localStorage.setItem("menuRunLimit", menuRunLimit)

    updateCurrentStepText();
    sendResponse({farewell: "popup farewell"});
    }
  }
);


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
  console.log("no way..")
  sendMessageToContentScript("start")
})
stopButton.addEventListener("click", () => {
  console.log("no way..")
  sendMessageToContentScript("stop")
})
resetButton.addEventListener("click", () => {
  console.log("no way..")
  sendMessageToContentScript("reset")
  menuCurrentStep = 0;
  localStorage.setItem("menuCurrentStep",0)
  updateCurrentStepText();
})

logButton.addEventListener("click", () => {
  console.log("no way..")
  sendMessageToContentScript("log")
})