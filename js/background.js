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