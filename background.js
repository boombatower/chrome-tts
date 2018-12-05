// Although the tts API indicates 32768 is the max the voice implementations are
// inconsistent and somewhere over 300 start to break.
const TTS_MAX_LENGTH = 300;

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tts.isSpeaking(function(speaking) {
    if (speaking) {
      chrome.tts.stop();
    } else {
      selectionRead();
    }
  });
});

function selectionRead()
{
  chrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  }, function(result) {
    if (result) {
      chrome.storage.sync.get({
        voice: null,
        rate: 1
      }, function(items) {
        textRead(result[0], items.voice, items.rate);
      });
    } else {
      console.log('no selection to read');
    }
  });
}

function textRead(text, voice, rate)
{
  var start = 0;
  var end;
  var substring;
  do {
    end = textChunk(text, start);
    substring = text.substring(start, end);
    start = end;

    console.log(substring);
    chrome.tts.speak(substring, {voiceName: voice, 'rate': rate, enqueue: true, onEvent: ttsEvent});
  }
  while (start < text.length);
}

function textChunk(text, start)
{
  if (text.length - start > TTS_MAX_LENGTH) {
    // Attempt to split by space.
    for (var i = start + TTS_MAX_LENGTH - 1; i >= start; i--) {
      if (text[i] == ' ') {
        return i;
      }
    }

    // Just break it since giant section.
    return start + TTS_MAX_LENGTH;
  }

  return text.length;
}

function ttsEvent(event)
{
  console.log(event);
}
