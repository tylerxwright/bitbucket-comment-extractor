window.onload = function(e) {
    chrome.storage.sync.get("runOnPage", function (obj) {
        chrome.tabs.getSelected(null, function(tab) {
            var pageUrl = new URL(tab.url);
            if(!(obj.runOnPage === undefined || obj.runOnPage === '*' || pageUrl.hostname === obj.runOnPage)) {
                document.getElementById("bit-ex-btn").style = "display: none";
                document.getElementById("popup").innerHTML = "Extension is not active on this page.<br/><br/>Check your filter in the options"
            }
        });
    });

    document.getElementById("bit-ex-btn").onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
                window.close();
            });
        });
    }
}