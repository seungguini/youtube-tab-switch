$(function(){
    $('#pause').click(function(){
        // get all the tabs in this window that are active
        chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "pauseVideo"});
        });
    });

    $('#play').click(function(){
        // get all the tabs in this window that are active
        chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "playVideo"});
        });
    });
});