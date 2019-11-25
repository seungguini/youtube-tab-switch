// this code will run each time a Youtube page is open

// send message to eventPage when user watches a YouTube video
// matching the URL format: "https://youtube.com/watch?v=*" - counts youtube.com as well, BUG FIX NEEDEDs
chrome.runtime.sendMessage({todo: "newVideoTab"});
//chrome.storage.sync.set({'activeTabIDs': []})

var vid = document.getElementsByClassName("video-stream html5-main-video");


// listener for pausing video
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "pauseVideo"){
        // get(0) gets the native DOM element, which actually has the play() function
        vid[0].pause();
    }
});

// listener for playing video
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "playVideo"){
        // get(0) gets the native DOM element, which actually has the play() function
        vid[0].play();
    }
});

// listener for pausing all sub-videos
chrome.runtime.onMessage.addListener(function(request, sender, sendResposne){
    if (request.todo == "pauseVideo"){
        vid[0].pause();
    }
});


vid[0].onplay = function() {
    chrome.runtime.sendMessage({todo: 'videoPlaying'});
}