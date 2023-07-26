document.addEventListener('DOMContentLoaded', function() {
  let saveButton = document.getElementById('saveButton');
  let progressBar = document.getElementById('progressBar');

  saveButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({message: 'historyCollectionStarted'});

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.message === 'historyCollectionProgress') {
        progressBar.value = request.progress;
      }

      if (request.message === 'historyCollectionCompleted') {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(request.browsingHistory)], {type: 'application/json'}));
        a.download = 'browsingHistory.json';
        a.click();
      }
    });
  });
});