// ==UserScript==
// @name         QBD bulk error destroyer
// @namespace    https://github.com/MichaelGombos/QBD-bulk-error-destroyer
// @version      0.1
// @description  Object integrate QBD errors in bulk
// @author       Michael Gombos
// @include      https://app0*.us.bill.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bill.com
// @grant        none
// ==/UserScript==


let runCount = localStorage.getItem("runCount") ? Number(localStorage.getItem("runCount")) : 0;
let runLimit = localStorage.getItem("runLimit") ? Number(localStorage.getItem("runLimit")) : 0;
let delay = localStorage.getItem("delay") ? Number(localStorage.getItem("delay")) : 50;





(function() {
    'use strict';

    setTimeout(() => {
        const allowExportButton = document.querySelector("#allowExport") //unsused.
        const objectIntegratedButton = document.querySelector("#objIntegrated")
        const nextButton = document.querySelector(`button[name="next"]`)
        console.log("CURRENT RUN:" , runCount)

        if(runCount < runLimit){
            if(nextButton && objectIntegratedButton){
                objectIntegratedButton.checked == false ? objectIntegratedButton.click() : console.log("already unchecked")
                setTimeout(() => {
                    nextButton.click();
                    localStorage.setItem("runCount",runCount+1)
                }, delay)
            }
        }


        window.next = () => {nextButton.click()}

        window.integratedToggle = () => {objectIntegratedButton.click()}
    }, delay)


window.clearRunCount = () => {
    localStorage.setItem("runCount",0)
    console.log("runCount cleared")
}

window.setRunLimit = (amount) => {
    localStorage.setItem("runLimit",amount)
    console.log("runLimit set to : ", amount)
}

window.setDelay = (amount) => {
    localStorage.setItem("delay",amount)
    console.log("delay set to : ", amount)
}
})();


