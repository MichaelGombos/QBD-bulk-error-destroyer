
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


const iterateOnce = ()  => {


logData = localStorage.getItem("logData") ? localStorage.getItem("logData") : "";
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
            pushCurrentFrameToLog();
            traverseUI();
        }
        else{
            console.log("can't find iframe, or not running", neoIframe, isRunning)
        }
    }, delay)



})();
}

const pushCurrentFrameToLog = () => {
    console.log("DID this run though?")
    iframeDocument = neoIframe.contentDocument;
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
  

const traverseUI = () => {
    setTimeout(() => {
    iframeDocument = neoIframe.contentDocument;
    console.log("what is our iframedocument looking like?", iframeDocument, neoIframe)
    allowExportButton = iframeDocument.querySelector("#allowExport") //unsused.
    objectIntegratedButton = iframeDocument.querySelector("#objIntegrated")
    nextButton = iframeDocument.querySelector(`button[name="next"]`)


    if(runCount < runLimit){
        console.log("going to iterate now.")
        if(nextButton && objectIntegratedButton){
            console.log("clicking and whatnot")
            objectIntegratedButton.checked == false ? objectIntegratedButton.click() : ""
            runCount += 1;
            updateRuncountText(runCount, runLimit);
            localStorage.setItem("runCount",runCount)
            nextButton.click();
            console.log("end of clicking and whatnote")
        }
        else{
            console.log("one of those buttons aren't showing up.", nextButton, objectIntegratedButton, "this is the iframe doc", iframeDocument)
        }
    }
    else{
        console.log("over run count limit.", runCount, runLimit, typeof runCount, typeof runLimit)
    }
    }, delay)

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
            traverseUI();
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
        console.log(response.farewell);
      });
}


// Select the node that will be observed for mutations
let targetNode = document.body; 
let config = { attributes: false, childList: true, subtree: true };

let observerCallback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.target.tagName !== "BODY") {
            console.log('A child node has been added or removed.', mutation , JSON.parse(JSON.stringify(mutation.target)));
            iterateOnce();
        }
    }
};
let observer = new MutationObserver(observerCallback);
observer.observe(targetNode, config);