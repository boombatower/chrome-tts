chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  }, function(selectedText) {
    chrome.tts.speak(selectedText[0], {'rate': 1.5});
  });
});
