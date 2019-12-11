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
        } else {
            chrome.storage.sync.set({'enabled': false});
        }
    });
});