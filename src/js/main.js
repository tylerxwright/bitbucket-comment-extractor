require.context('../images', true, /^\.\//);
require('../css/style.css');
require('../../node_modules/toastr/build/toastr.css');

var toastr = require('toastr');

function logComments(filter) {
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var height = Math.floor(windowHeight/2);
    var markup = "";
    var result = "<div style='width:100%;height:"+height+"px;overflow-y:scroll;border:solid 1px black;margin-bottom:10px;'><ul>";
    var url = window.location.href;
    if (url.indexOf('?') !== -1) {
        url = url.substring(0, url.indexOf('?'));
    }
    
    var messages = document.getElementsByClassName('message markup');
    
    if(messages.length === 0) {
        toastr.error('No comments found');
        return;
    }

    for (var i = 0; i < messages.length; i++) {
        var text = messages[i].getAttribute('data-text');
        var id = messages[i].parentElement.parentElement.getAttribute('data-id');
        var link = url + "?commentId=" + id;
        
        if (filter && text.indexOf(filter) === -1) {
            continue;
        }
        
        result += "<li style='margin-bottom: 8px'>" + text + "<a href='" + link + "'>View Comment</a>" + '</li>';
        markup += "* " + text + " [Link|" + link + "]" + '\n';
    }
    
    result += '</ul></div>';

    document.body.innerHTML += '<dialog style="width: 50%; padding:10px;">'+result+'<div style="width:100%;text-align:center;"><button id="bit-btn-close">Close</button>&nbsp&nbsp<button id="bit-btn-copy">Copy Markdown</button></div></dialog>';
    var dialog = document.querySelector("dialog")
    dialog.querySelector("#bit-btn-close").addEventListener("click", function() {
        dialog.close();
    });
    dialog.querySelector("#bit-btn-copy").addEventListener("click", function() {
        navigator.clipboard.writeText(markup);
        toastr.success('Markdown copied to the clipboard');
    });
    dialog.showModal();

    toastr.success('Comments Extracted');
} 

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        logComments();
    }
);