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
            chrome.tabs.getSelected(null, function(tab){
                //alert("tab id is: " + tab.id);
                
                // if data.tabArray has already been initialized
                if (data.tabArray) {
                    tabArray = data.tabArray;
                    tabArray.push(tab.id);
                    //alert("tab already initialized");
                }
                else {
                    tabArray = [tab.id];
                    //alert("tab initializing for the first time");
                }
                //alert("finished");
                // set updated tabArray
                chrome.storage.sync.set({'tabArray': tabArray});
            });
        });
    }
});

// when a video has started playing, stop all other videos
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
   // get all current YouTube tabs
   chrome.storage.sync.get('tabArray', function(data){
       chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
           // loop through all tabs
           var index;
           for (index in data.tabArray){
               chrome.tabs.sendMessage(data.tabArray[index], {todo: "pauseVideo"});
           }
       });
   });
});