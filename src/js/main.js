require.context('../images', true, /^\.\//);
require('../css/style.css');
require('../../node_modules/toastr/build/toastr.css');

var toastr = require('toastr');

function logComments(filter) {
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var height = Math.floor(windowHeight/2);
    var markup = "";
    var result = "<div style='width:100%;height:"+height+"px;overflow-y:scroll;border:solid 1px black;margin-bottom:10px;'>";
    var url = window.location.href;
    if (url.indexOf('?') !== -1) {
        url = url.substring(0, url.indexOf('?'));
    }
    
    var messages = document.getElementsByClassName('message markup');
    var commentList = document.getElementsByClassName('comment-container comment-box');
    
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
        
        markup += "* " + text + " [Link|" + link + "]" + '\n';
    }

    for(var i = 0; i < commentList.length; i++) {
        var commentMarkup = commentList[i].outerHTML;
        var linkMatch = commentMarkup.match(/data-id=\"([0-9]{1,})?/);
        if(linkMatch.length >= 2) {
            var commentId = linkMatch[1];
            var textMatch = commentMarkup.match(/<p>(.+)<\/p>/);
            if(textMatch.length >= 2) {
                var start = textMatch.index;
                var length = textMatch[1].length;
                commentMarkup = commentMarkup.slice(0, start)+"<a href='"+url+"?commentId="+commentId+"' target='_blank'>"+commentMarkup.slice(start, start+length+3)+"</a>"+commentMarkup.slice(start+length+3);
            }
        }
        result += commentMarkup;
    }
    
    result += '</div>';

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