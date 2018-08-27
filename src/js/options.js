function save_options() {
    var domain = document.getElementById('bitbucketDomain').value;
    chrome.storage.sync.set({
        bitbucketDomain: domain
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        chrome.tabs.sendMessage(tabs[0].id, {type:"reload"});
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get("bitbucketDomain", function(items) {
        if(items.bitbucketDomain === undefined) {
            items.bitbucketDomain = "https://bitbucket.org/"
        }
        document.getElementById('bitbucketDomain').value = items.bitbucketDomain+"*";
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);