console.log("The popup has been summoned mwahahahah!")

const runLimitInput = document.querySelector("#runLimit")
const delayInput = document.querySelector("#runDelay")
const startButton = document.querySelector("#start-btn")
const stopButton = document.querySelector("#stop-btn")
const resetButton = document.querySelector("#reset-btn")
const logButton = document.querySelector("#log-btn")
const currentStepText = document.querySelector("#currentStep")

console.log("are all of my values here?",
runLimitInput,
delayInput,
startButton,
logButton,
currentStepText)

const sendMessageToContentScript = (type, value ) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Send a message to the content script in the active tab
    chrome.tabs.sendMessage(tabs[0].id, {type, value});
});
}



delayInput.addEventListener("change", () => {
  console.log("input yep")
  sendMessageToContentScript("delay",delayInput.value)
} )
runLimitInput.addEventListener("change", () => {
  console.log("input yep")
  sendMessageToContentScript("runLimit",runLimitInput.value)
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
})

logButton.addEventListener("click", () => {
  console.log("no way..")
  sendMessageToContentScript("log")
})