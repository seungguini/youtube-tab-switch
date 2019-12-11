/**
 * The background script. The main 'hub' for the extension, handling the TabArray which maintains all open YouTube tabs.
 * Communicates with each tab's content script to control video playback.
 */
// log the tab id into chrome.storage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    // get number of Tabs active from chrome storage
    if(request.todo == "newVideo"){
        var tabArray;
        chrome.storage.sync.get({'tabArray':[]},function(data) {
            var tabArray = data.tabArray;
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
            var tabArray = data.tabArray;
            // reorder video play priority, so the this video is the last in array
            tabArray = reorderArray(tabArray, sender.tab.id);
            var tabArray = data.tabArray;

            // pause all other videos ONLY if app is enabled
            if (data.enabled) {
                // loop through all tabs
                var index;
                for (index in tabArray){
                    // exclude the current video
                    if (tabArray[index] != sender.tab.id) {
                        chrome.tabs.sendMessage(tabArray[index], {todo: "pauseVideo"});
                    }
                }
                console.log(tabArray.toString())
                chrome.storage.sync.set({'tabArray': tabArray});
            }
        });
    }
});

// fillAudio ONLY if app is toggled
// if the main video pauses, fill audio by playing the most recent tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
   if (request.todo == "fillAudio"){
       chrome.storage.sync.get({'tabArray':[], 'enabled':true}, function(data){
          if(data.tabArray && data.enabled){
            var tabArray = data.tabArray;
            var length = tabArray.length;
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
            var tabArray = data.tabArray;
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
    var index = tabArray.indexOf(id);
    if (index > -1) {
        tabArray.splice(index, 1);
    }
    return tabArray;
}

// reorders the specified id to the end of the array
// @param the array to be reorganized
// @param id the id to be reorganized
function reorderArray(tabArray, id) {
    var splicedArray = spliceArray(tabArray, id);
    splicedArray.push(id);
    return splicedArray;
}



// initialize tabArray if empty, or push tab id to the list
// @param tabArray the array that holds all video tab ids
// @param id the tab to add to tabArray
function queueVideo(tabArray, id) {
    if (tabArray) {
        // make sure tab is not duplicated
        if (!tabArray.includes(id)) {
            tabArray.push(id);
        } else { // if for some reason tab id already exists, bring it to the front
            reorderArray(tabArray,id);
        }
    }
    else {
        tabArray = [id];
        //("tab initializing for the first time");
    }
    return tabArray;
}
