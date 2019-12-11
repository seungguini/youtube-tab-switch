$(function(){
    $('.toggle-app').change(function() {
        chrome.storage.sync.get({'enabled': true}, function(data){
            var en = data.enabled;
            en ^= en // toggle the boolean
            chrome.storage.sync.set({'enabled': en});
        });     
    });
});