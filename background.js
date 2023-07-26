chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setPopup({ popup: 'popup.html' });
});

let browsingHistory = [];

async function collectBrowsingHistory() {
  let oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  let searchQuery = {
    text: '',
    startTime: oneMonthAgo.getTime(),
    maxResults: 1000000
  };

  chrome.history.search(searchQuery, function(results) {
    browsingHistory = results;
    chrome.runtime.sendMessage({ message: 'historyCollectionCompleted' });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'collectBrowsingHistory') {
    collectBrowsingHistory();
  }
});

function saveHistoryAsJson() {
  let json = JSON.stringify(browsingHistory);
  let blob = new Blob([json], { type: 'application/json' });
  let url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: 'browsingHistory.json'
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'saveHistoryAsJson') {
    saveHistoryAsJson();
  }
});