/**
 * The background script. The main 'hub' for the extension, handling the TabArray which maintains all open YouTube tabs.
 * Communicates with each tab's content script to control video playback.
 */

/* Use activeTab to access the tab the user is currently on */

/*
When chrome installs and runs the extension for the first time, read and insert all YouTube tabs. Tabs are inserted
from left to right, with the right-most tab having most priority
*/
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get({'tabArray':[]}, function(data){
        chrome.tabs.query({'url': "*://*.youtube.com/watch?v=*"}, function (tabs) {
            var tabArray = data.tabArray;
            for (i in tabs) {
                chrome.tabs.reload(tabs[i].id);
                /*
                tabArray = queueVideo(tabArray, tabs[i].id);

                // inject script into each YouTube tab
                chrome.tabs.executeScript(tabs[i].id, {file: "js/content.js"});
                */
            }

            // play the right-most video
            if (data.tabArray.length > 0) {
                // when changed to enabled, play only the most recent vdieo
                chrome.tabs.sendMessage(tabArray[tabArray.length-1], {todo: "playVideo"});
            }

            chrome.storage.sync.set({'tabArray': tabArray});
        });
    });
});

 // log the tab id into chrome.storage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    // get number of Tabs active from chrome storage
    if(request.todo == "newVideo"){
        let tabArray;
        chrome.storage.sync.get({'tabArray':[]},function(data) {
            let tabArray = data.tabArray;
            tabArray = queueVideo(tabArray, sender.tab.id);

            console.log(tabArray.toString())
            // set updated tabArray
            chrome.storage.sync.set({'tabArray': tabArray});
        });
    }
});

// when a video has started playing, stop all other videos
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "videoPlaying"){
        // get all current YouTube tabs
        chrome.storage.sync.get({'tabArray':[], 'enabled': true}, function(data){
            let tabArray = data.tabArray;
            // reorder video play priority, so the this video is the last in array
            tabArray = reorderArray(tabArray, sender.tab.id);

            // pause all other videos ONLY if app is enabled
            if (data.enabled) {
                // loop through all tabs
                let index;
                for (index in tabArray){
                    // exclude the current video
                    if (tabArray[index] != sender.tab.id) {
                        chrome.tabs.sendMessage(tabArray[index], {todo: "pauseVideo"});
                    }
                }
                console.log(tabArray.toString())
            }
            
            chrome.storage.sync.set({'tabArray': tabArray});
        });
    }
});

// fillAudio ONLY if app is toggled
// if the main video pauses, fill audio by playing the most recent tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
   if (request.todo == "fillAudio"){
       chrome.storage.sync.get({'tabArray':[], 'enabled':true}, function(data){
          if(data.tabArray && data.enabled){
            let tabArray = data.tabArray;
            let length = tabArray.length;
            // if the video paused is the main video
            if (sender.tab.id == tabArray[length-1]) {
                if (length > 1) {
                    // play video with immediate inferior priority
                    // the play video will in turn reorder this as the new priority video
                    chrome.tabs.sendMessage(tabArray[length-2], {todo: "playVideo"});
                }
            }
          } 
       });
   } 
});

// unqueue tab from tabArray
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
   if (request.todo == "unqueueTab") {
        chrome.storage.sync.get('tabArray',function(data){
            let tabArray = data.tabArray;
            // find the index of the id of the tab to remove in the tabArray
            // remove the id from tabArray
            spliceArray(tabArray,sender.tab.id);

            console.log(tabArray.toString())
            chrome.storage.sync.set({'tabArray': tabArray});
        });
   } 
});

// removes a specific id from the tabArray.
// @param tabArray the array to be spliced
// @param id the id to be spliced
function spliceArray(tabArray, id) {
    let index = tabArray.indexOf(id);
    if (index > -1) {
        tabArray.splice(index, 1);
    }
    return tabArray;
}

// reorders the specified id to the end of the array
// @param the array to be reorganized
// @param id the id to be reorganized
function reorderArray(tabArray, id) {
    let splicedArray = spliceArray(tabArray, id);
    splicedArray.push(id);
    return splicedArray;
}



// initialize tabArray if empty, or push tab id to the list
// @param tabArray the array that holds all video tab ids
// @param id the tab to add to tabArray
function queueVideo(tabArray, id) {
    var ta = tabArray;
    if (ta) {
        // make sure tab is not duplicated
        if (!ta.includes(id)) {
            ta.push(id);
        } else { // if for some reason tab id already exists, bring it to the front
            reorderArray(ta,id);
        }
    }
    else {
        ta = [id];
        //("tab initializing for the first time");
    }
    return ta;
}
