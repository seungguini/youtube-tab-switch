/**
 * The content script. The content script runs each time the url of the format *://*.youtube.com/* is matched.
 * There are three major cases where this can happen:
 * 1. The YouTube homepage at *://*.youtube.com/
 * 2. A YouTube video page at *://*.youtube.com/watch?v=*
 * 3. A YouTube search page at *://*.youtube.com/results?search_query=*
 * Each tab that matches the url above gets its own content page.
 * For more on content scripts, visit: {@link https://developer.chrome.com/extensions/content_scripts}.
 * @author Seunggun Lee
 * 
 */

/**
 * Handles the user leaving the current video, whether by choosing a new video, closing the tab, or going to a new website.
 */
window.addEventListener('beforeunload', (event) => {
    chrome.runtime.sendMessage({todo: 'unqueueTab'});
    chrome.runtime.sendMessage({todo: 'fillAudio'});
});

// listen for AJAX youtube content change
// yt-navigate-start won't catch initial entry into YouTube page
/**
 * Listens for YouTube's AJAX page load when a new video is played within the same tab. YouTube uses dynamic
 * loading to avoid having to reload the whole page when a user plays a new video. We catch this load with
 * YouTube's event "yt-page-data-updated".
 */
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
    }
    else {
        chrome.runtime.sendMessage({todo: 'unqueueTab'});
        chrome.runtime.sendMessage({todo: 'fillAudio'});
    }
});
