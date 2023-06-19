
let neoIframe
let iframeDocument 
let allowExportButton 
let objectIntegratedButton 
let nextButton 
let table

let isRunning 
let runCount 
let runLimit 
let delay 
let logData


const destroyer = ()  => {


logData = localStorage.getItem("logData") ? localStorage.getItem("logData") : "";
isRunning = localStorage.getItem("isRunning") ? JSON.parse(localStorage.getItem("isRunning")) : false;
runCount = localStorage.getItem("runCount") ? Number(localStorage.getItem("runCount")) : 0;
runLimit = localStorage.getItem("runLimit") ? Number(localStorage.getItem("runLimit")) : 0;
delay = localStorage.getItem("delay") ? Number(localStorage.getItem("delay")) : 50;



(function() {
    'use strict';

    setTimeout(() => {
        neoIframe = document.querySelector("#neoIframe")
        iframeDocument = neoIframe.contentDocument;
        if(neoIframe && isRunning){ 
            console.log("CURRENT RUN:" , runCount)
            pushCurrentFrameToLog();
            iterateOnce();
        }
        else{
            console.log("can't find iframe, or not running", neoIframe, isRunning)
        }
    }, delay)



})();
}

const pushCurrentFrameToLog = () => {
    table = iframeDocument.querySelector(".dc-two  table");
    if(table !== null){
        let tableText = table.innerText
        const formattedText = tableText.replace(/\n/g, '__').replace(/\t/g, '_')
        const endIndex = formattedText.indexOf("Edit Fields for Sync");
        const trimmedText = formattedText.substring(0, endIndex).trim();
    
        logData = logData.concat(trimmedText + '|')
        localStorage.setItem("logData",logData)
        
    }
}

function downloadLogAsFile() {
    const data = JSON.stringify(logData.split("|"));
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = "QBDErrorDestroyerLog";
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    URL.revokeObjectURL(url);
  }
  

const iterateOnce = () => {

    allowExportButton = iframeDocument.querySelector("#allowExport") //unsused.
    objectIntegratedButton = iframeDocument.querySelector("#objIntegrated")
    nextButton = iframeDocument.querySelector(`button[name="next"]`)


    if(runCount < runLimit){
        if(nextButton && objectIntegratedButton){
            objectIntegratedButton.checked == false ? objectIntegratedButton.click() :
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
            localStorage.setItem("logData", "")
            logData = ""
            localStorage.setItem("isRunning", false)
            break;
        case "log":
            console.log("log opened from popup (not working yet)")
            downloadLogAsFile();
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
    chrome.runtime.sendMessage({
        popupRequestType: "updateRuncount",
        data: {newValue,limit}
    }, function(response) {
        // console.log(response.farewell);
      });
}


// Select the node that will be observed for mutations
let targetNode = document.body; 
let config = { attributes: false, childList: true, subtree: true };

let observerCallback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // console.log('A child node has been added or removed.');
            destroyer();
        }
    }
};
let observer = new MutationObserver(observerCallback);
observer.observe(targetNode, config);