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
        const neoIframe = document.querySelector("#neoIframe")
        if(neoIframe && isRunning){ //TODO add isrunning boolean
            console.log("isRunning", isRunning)
            iframeDocument = neoIframe.contentDocument;
            allowExportButton = iframeDocument.querySelector("#allowExport") //unsused.
            objectIntegratedButton = iframeDocument.querySelector("#objIntegrated")
            nextButton = iframeDocument.querySelector(`button[name="next"]`)

            console.log("CURRENT RUN:" , runCount)
            iterateOnce();

        }
        else{
            console.log("can't find iframe")
        }
    }, delay)



})();
}

const iterateOnce = () => {
    if(runCount < runLimit){
        console.log("So I tried to run here.")
        if(nextButton && objectIntegratedButton){
            objectIntegratedButton.checked == false ? objectIntegratedButton.click() : console.log("already unchecked")
            setTimeout(() => {
                nextButton.click();
                localStorage.setItem("runCount",runCount+1)
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
            break;
        case "runLimit":
            console.log("runLimit modified from popup")
            localStorage.setItem("runLimit",value)
            break;
        case "start":
            console.log("started from popup")
            localStorage.setItem("isRunning",true)
            iterateOnce();
            break;
        case "stop":
            console.log("stopped from popup")
            localStorage.setItem("isRunning", false)
            break;
        case "reset":
            console.log("reset from popup")
            localStorage.setItem("runCount", 0)
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


// Select the node that will be observed for mutations
let targetNode = document.body; // Change this to any other node based on the SPA structure

// Options for the observer (which mutations to observe)
let config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
let callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // This indicates a change in the DOM tree; do something here
            console.log('A child node has been added or removed.');
            //try to run the destroyer script:
            destroyer();
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
let observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);