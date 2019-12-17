
/* SCRIPT FOR DISPLAYING TAB LIST */
/*
chrome.storage.sync.get({'tabArray': []}, function(data){
    let tablist = $('#tab-list');
    for (tb in data.tabArray) {
        let tabContent = `
        <div class="tab" id=${tab.id}>

         Should make an object... 
            containing info about the video
            for display...
        
        
        `

        tablist.append($(tabContent));
    }   
}
*/

/* SCRIPT FOR ENABLING/DISABLING APP*/

// set toggle value
chrome.storage.sync.get({'enabled':true}, function(data){
    if (data.enabled) {
        $('#toggle-app').prop('checked', true);
    } else {
        $('#toggle-app').prop('checked', false);
    }
});


// handle toggle
$(function(){
    $('#toggle-app').change(function() {
        if ($('#toggle-app').prop('checked')) {
            chrome.storage.sync.set({'enabled': true});
            chrome.storage.sync.get({"tabArray": []}, function(data){
                if (data.tabArray.length > 0) {
                    // when changed to enabled, play only the most recent vdieo
                    chrome.tabs.sendMessage(data.tabArray[data.tabArray.length-1], {todo: "playVideo"});
                }
            });
        }
        else {
            chrome.storage.sync.set({'enabled': false});
        }
    });
});