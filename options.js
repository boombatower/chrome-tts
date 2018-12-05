document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

function loadVoices()
{
  chrome.tts.getVoices(
    function(voices) {
      var voiceElement = document.getElementById('voice');
      var option;
      for (var i = 0; i < voices.length; i++) {
        option = document.createElement('option');
        option.text = voices[i].voiceName;
        voiceElement.add(option);
      }
    });
}

function restore_options() {
  loadVoices();

  chrome.storage.sync.get({
    voice: null,
    rate: 1
  }, function(items) {
    document.getElementById('voice').value = items.voice;
    document.getElementById('rate').value = items.rate;
  });
}

function save_options() {
  chrome.storage.sync.set({
    voice: document.getElementById('voice').value,
    rate: parseFloat(document.getElementById('rate').value)
  });
}
