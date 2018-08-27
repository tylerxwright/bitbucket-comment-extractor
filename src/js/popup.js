window.onload = function(e) {
    document.getElementById("bit-ex-btn").onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type:"extract"}, function(response) {
                window.close();
            });
        });
    }
}