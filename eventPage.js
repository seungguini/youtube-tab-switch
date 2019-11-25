/*
chrome.runtime.sendMessage({greeting:"hello"}, function(response) {
    console.log(response.farewell);
});

chrome.tabs.query({active: true, currentWindow: true}, functions(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response){
        console.log(response.farewell());
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(sender.tab ? "from a content script" + sender.tab.url: "from the extension");
    if (request.greeting == "hello") P
    sendResponse({farewell: "goodbye"});
});

// html video tag has property .paused
*/

var numTabs = 0;

// handle message from content.js and showPageAction
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "showPageAction"){
        chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        });
    };
});

// logs tab id of a new YouTube tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "logVideoTab"){
        var tabArray;
        chrome.tabs.getSelected(null, function(tab){
            // if there are no current videos tabs playing, initialize array
            if (numTabs == 0) {
                chrome.storage.sync.get(tabArray:[], function(data){
                    tabArray = data.tabArray;
                    tabArray.push(tab.id);
                });
            }
            // push tab id onto existing tabArray
            else {
                chrome.storage.sync.get('tabArray', function(data){
                    tabArray = data.tabArray;
                    tabArray.push(tab.id);
                });
            }
            // set updated tabArray
            chrome.storage.sync.set({'tabArray': tabArray});
        });
    };
});

