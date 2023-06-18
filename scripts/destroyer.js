const destroyer = ()  => {

let runCount = localStorage.getItem("runCount") ? Number(localStorage.getItem("runCount")) : 0;
// let runLimit = localStorage.getItem("runLimit") ? Number(localStorage.getItem("runLimit")) : 0;
let runLimit = 5;
let delay = localStorage.getItem("delay") ? Number(localStorage.getItem("delay")) : 50;


(function() {
    'use strict';

    setTimeout(() => {
        const neoIframe = document.querySelector("#neoIframe")
        if(neoIframe){
            const iframeDocument = neoIframe.contentDocument;
            const allowExportButton = iframeDocument.querySelector("#allowExport") //unsused.
            const objectIntegratedButton = iframeDocument.querySelector("#objIntegrated")
            const nextButton = iframeDocument.querySelector(`button[name="next"]`)
            console.log("CURRENT RUN:" , runCount)
    
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
        else{
            console.log("can't find iframe")
        }
    }, delay)



})();
}



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