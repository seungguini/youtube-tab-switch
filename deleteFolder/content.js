// send message to eventPage when user watches a YouTube video
// matching the URL format: "https://youtube.com/watch?v=*"
chrome.runtime.sendMessage({todo: "showPageAction"});


// listener for pausing video
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "pauseVideo"){
        // get(0) gets the native DOM element, which actually has the play() function
        var vid = document.getElementsByClassName("video-stream html5-main-video");
        vid[0].pause();
    }
});

// listener for playing video
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "playVideo"){
        // get(0) gets the native DOM element, which actually has the play() function
        var vid = document.getElementsByClassName("video-stream html5-main-video");
        vid[0].play();
    }
});