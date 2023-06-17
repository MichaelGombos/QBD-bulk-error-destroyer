# QBD Bulk Error Clear Tool

This is a tool built to clear QBD sync errors from the bill.com sync status page

To use this script. You will need the tampermonkey google chrome extension

Once this extension is installed. You can click directly on the tampermonkey extension icon, then click "create new script"

You can then paste in the contents from the destroyer.js file in this repository.

Once you have pasted in the contents. Hit "file" then "save" (in the top left.)

Then click on "installed userscripts" in the top right, and make sure your new script is enabled.

Now you can refresh your page. This script will now be active.

window.setRunLimit() will allow you to set the amount of times you want this script to run
window.setDelay() will allow you to set the amount of time between each iteration
window.clearRunCount() will allow you to reset the internal counter for the current iteration

to start the script, you will need to be on the sync status page. Then, click on the edit symbol next to "fix" on the first error.

The script will then run through all of the errors until It reaches the last one.

Here is a video example of setting up the script [timestamp], and then running it [timestamp]. 

I plan to turn this script into a chrome extension, and add a user interface to make it more user freindly. 