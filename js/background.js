chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.storage.local.get('disableNewTab', function(data) {
    if (!data.disableNewTab && tab.url === 'chrome://newtab/') {
        chrome.tabs.update(tab.id, {url: './newtab.html'});
    }
  });
});

chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "options.html"
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "fetchICS") {
    fetch(request.url)
      .then(response => response.text())
      .then(data => sendResponse({data: data}))
      .catch(error => sendResponse({error: error}));
    return true; // keeps the message channel open for sendResponse
  }
});
