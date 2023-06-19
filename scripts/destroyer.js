
let neoIframe
let iframeDocument 
let allowExportButton 
let objectIntegratedButton 
let nextButton 

let isRunning 
let runCount 
let runLimit 
let delay 

const destroyer = ()  => {

isRunning = localStorage.getItem("isRunning") ? JSON.parse(localStorage.getItem("isRunning")) : false;
runCount = localStorage.getItem("runCount") ? Number(localStorage.getItem("runCount")) : 0;
runLimit = localStorage.getItem("runLimit") ? Number(localStorage.getItem("runLimit")) : 0;
delay = localStorage.getItem("delay") ? Number(localStorage.getItem("delay")) : 50;



(function() {
    'use strict';

    setTimeout(() => {
        neoIframe = document.querySelector("#neoIframe")
        if(neoIframe && isRunning){ 
            console.log("CURRENT RUN:" , runCount)
            iterateOnce();
        }
        else{
            console.log("can't find iframe, or not running", neoIframe, isRunning)
        }
    }, delay)



})();
}

const iterateOnce = () => {
    console.log("hello? anybody home", runCount, runLimit)

    iframeDocument = neoIframe.contentDocument;
    allowExportButton = iframeDocument.querySelector("#allowExport") //unsused.
    objectIntegratedButton = iframeDocument.querySelector("#objIntegrated")
    nextButton = iframeDocument.querySelector(`button[name="next"]`)


    if(runCount < runLimit){
        console.log("So I tried to run here.")
        if(nextButton && objectIntegratedButton){
            objectIntegratedButton.checked == false ? objectIntegratedButton.click() : console.log("already unchecked")
            setTimeout(() => {
                updateRuncountText(runCount+1, runLimit);
                localStorage.setItem("runCount",runCount+1)
                nextButton.click();
            }, delay)
        }
        else{
            console.log("one of those buttons aren't showing up.", nextButton, objectIntegratedButton)
        }
    }
}

const evaluatePopupMessage = (type, value) => {
    switch(type){
        case "delay":
            console.log("delay modified from popup")
            localStorage.setItem("delay",value)
            delay = value
            break;
        case "runLimit":
            console.log("runLimit modified from popup")
            runLimit = value
            localStorage.setItem("runLimit",value)
            break;
        case "start":
            console.log("started from popup")
            localStorage.setItem("isRunning",true)
            isRunning = true;
            iterateOnce();
            break;
        case "stop":
            console.log("stopped from popup")
            localStorage.setItem("isRunning", false)
            isRunning = false;
            break;
        case "reset":
            console.log("reset from popup")
            localStorage.setItem("runCount", 0)
            runCount = 0;
            localStorage.setItem("isRunning", false)
            break;
        case "log":
            console.log("log opened from popup (not working yet)")
            break;
        default:
            console.log("invalid command")
            break;
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Check if data is present in the message
        if (request.type) {
            // Save the data to local storage
            evaluatePopupMessage(request.type,request.value)
        }
    }
);

const updateRuncountText = (newValue, limit) => {
    console.log("just tried to send a message lol")
    chrome.runtime.sendMessage({
        popupRequestType: "updateRuncount",
        data: {newValue,limit}
    }, function(response) {
        console.log(response.farewell);
      });
}


// Select the node that will be observed for mutations
let targetNode = document.body; 
let config = { attributes: false, childList: true, subtree: true };

let observerCallback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            destroyer();
        }
    }
};
let observer = new MutationObserver(observerCallback);
observer.observe(targetNode, config);