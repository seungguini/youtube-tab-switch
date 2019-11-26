/*
chrome.runtime.sendMessage({greeting:"hello"}, function(response) {
    //alert(response.farewell);
});

chrome.tabs.query({active: true, currentWindow: true}, functions(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response){
        //alert(response.farewell());
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    //alert(sender.tab ? "from a content script" + sender.tab.url: "from the extension");
    if (request.greeting == "hello") P
    sendResponse({farewell: "goodbye"});
});

// html video tag has property .paused
*/

// show pageAction
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "newVideoTab"){
        chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        });
    }
});

// log the tab id into chrome.storage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    // get number of Tabs active from chrome storage
    if(request.todo == "newVideoTab"){
        //alert("inside newVideoTab listener");
        var tabArray;
        chrome.storage.sync.get('tabArray',function(data) {
            //alert("got tab Array");
            //alert("tab id is: " + tab.id);
            
            // if data.tabArray has already been initialized
            if (data.tabArray) {
                tabArray = data.tabArray;
                tabArray.push(sender.tab.id);
                //alert("tab already initialized");
            }
            else {
                tabArray = [sender.tab.id];
                //alert("tab initializing for the first time");
            }
            //alert("finished");
            // set updated tabArray
            chrome.storage.sync.set({'tabArray': tabArray});
        });
    }
});

// when a video has started playing, stop all other videos
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "videoPlaying"){
        // get all current YouTube tabs
        chrome.storage.sync.get('tabArray', function(data){
            var tabArray = data.tabArray;
            // pause all other videos
            chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
                // loop through all tabs
                var index;
                for (index in tabArray){
                    // exclude the current video
                    if (tabArray[index] != sender.tab.id) {
                        chrome.tabs.sendMessage(tabArray[index], {todo: "pauseVideo"});                        
                    }
                }
            });
            
            // reorder video play priority, so the most recent vid is the last in array
            tabArray = reorderArray(tabArray, sender.tab.id);
            chrome.storage.sync.set({'tabArray': tabArray});
        });
    }
});

// if the main video pauses, fill audio by playing the most recent tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
   if (request.todo == "fillAudio"){
       chrome.storage.sync.get('tabArray', function(data){
          if(data.tabArray){
            var tabArray = data.tabArray;
            var length = tabArray.length;
            if (length > 1) {
                // play video with immediate inferior priority
                // the play video will in turn reorder this as the new priority video
                chrome.tabs.sendMessage(tabArray[length-2], {todo: "playVideo"});
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
            alert("before removal: " + tabArray.join());
            // remove the id from tabArray
            spliceArray(tabArray,sender.tab.id);
            alert("after removal: " + tabArray.join());
            
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
    return splicedArray.push(id);
}