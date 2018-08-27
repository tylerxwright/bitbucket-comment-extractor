function intercept(details) {
    var url = details.url;
    console.log("Intercepting...");
    if(url.includes("activities")) {
        var strippedUrl = url.substring(0, url.indexOf('?')+1);
        var hijackedRequest = strippedUrl+"start=0&limit=1000&avatarSize=64&markup=true"
        console.log("Hijacking request with: "+hijackedRequest);
        return {redirectUrl: hijackedRequest};
    }
}

function load() {
    console.log('load');
    chrome.storage.sync.get("bitbucketDomain", function(settings) {
        if(settings.bitbucketDomain === undefined) {
            settings.bitbucketDomain = "https://bitbucket.org/"
        }
        if(settings.bitbucketDomain.endsWith("/")) {settings.bitbucketDomain += "*"}
        else if(!settings.bitbucketDomain.endsWith("/*")) {settings.bitbucketDomain += "/*"}
        console.log("Using the domain: "+settings.bitbucketDomain);
        chrome.webRequest.onBeforeRequest.addListener(
            intercept, {
                urls: [
                    "<all_urls>"
                ],
                types: ["xmlhttprequest"]
            },
            ["blocking"]
        );
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type === "reload") {
            console.log("Reloading the background")
            load();
        }
    }
);

load();