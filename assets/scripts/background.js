(function(){
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  	if(changeInfo.status == 'loading') {
  		var start = tab.url.substring(0, 4);
  		if (start == 'http' || start == 'ftp:') {
  			chrome.pageAction.show(tabId);
  		}
  	}
  });
})()