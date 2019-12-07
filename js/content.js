//alert("match!");
/*
this code will run each time a *://*.youtube.com/* is opened. We must catch two major cases:
  1. The YouTube homepage at *://*.youtube.com/. No video is playing. Listen to event
      'yt-page-data-update' to catch a new video playing.
  2. An actual YouTube video with the format of *://*.youtube.com/watch?v=* . Queue this tab.

  When a new video is played, it should be queued. When a video exits (close tab, pressing the
    back button on the browser, clicking on a new video within the same tab, going back to the 
    YouTube home page, or any other non-video YouTube page)
*/

/*
DETECTING CHANGE IN HISTORY STATE THROUGH THE BACKGROUND PAGE
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"contentscript.js"});
});

*/



// sends message to eventPage to unqueue this tab if the user
// 1. exits the tab
// 2. enters a new video or page on the same tab
// 3. reloads the same tab to watch the same video
window.addEventListener('beforeunload', (event) => {
    chrome.runtime.sendMessage({todo: 'unqueueTab'});
    chrome.runtime.sendMessage({todo: 'fillAudio'});
});

// listen for AJAX youtube content change
// yt-navigate-start won't catch initial entry into YouTube page
window.addEventListener("yt-page-data-updated", function() {
    // check if a video is playing
    // if this doesn't work we could use window.location.href
    // split that url by ("/")
    // and then check if the tail contains "watch?v="

        var url = window.location.href.split("/"); // expected url format: *://*.youtube.com/*
        if (url[3].startsWith("watch?v=")) {
            chrome.runtime.sendMessage({todo: "newVideo"});
            chrome.runtime.sendMessage({todo: "videoPlaying"});

        var vid = document.getElementsByClassName("video-stream html5-main-video");

        vid[0].addEventListener("play", function(){
            chrome.runtime.sendMessage({todo: 'videoPlaying'});
        });

        // if the main video pauses, play the most recent video to fill audio
        vid[0].addEventListener("pause", function(){
        chrome.runtime.sendMessage({todo: 'fillAudio'}); 
        });

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
        // if we go to a non-video YouTube page (i.e. homepage or searchpage),
        // unqueue tab and fill audio
        } else {
            chrome.runtime.sendMessage({todo: 'unqueueTab'});
            chrome.runtime.sendMessage({todo: 'fillAudio'});
        }
});
