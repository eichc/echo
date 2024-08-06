let mediaRecorder;
let audioChunks = [];

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      mediaRecorder.start();
      document.getElementById("record-btn").disabled = true;
      document.getElementById("stop-btn").disabled = false;
    });
}

function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    audioChunks = [];
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = document.getElementById("audio-playback");
    audio.src = audioUrl;
    document.getElementById("record-btn").disabled = false;
    document.getElementById("stop-btn").disabled = true;
  };
}

function showSection(sectionClass) {
  const sections = document.querySelectorAll("main section");
  sections.forEach(section => {
    if (section.classList.contains(sectionClass)) {
      section.style.display = "block";
    } else if (!section.classList.contains("selection-section")) {
      section.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showSection("selection-section");
});

async function handleFileInput() {
  const formData = new FormData(document.getElementById('upload-form'));
  const response = await fetch('http://127.0.0.1:5000/upload', {
    method: 'POST',
    body: formData
  });
  const result = await response.text();
  document.getElementById('output').innerText = result;
}

async function handleAudioInput() {
  const formData = new FormData();
  const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
  formData.append('file', audioBlob, 'recorded_audio.mp3');
  formData.append('filename', document.getElementById('audio-file-input').value);
  formData.append('format_choice', document.querySelector('input[name="format_choice"]:checked').value);

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData
  });
  const result = await response.text();
  document.getElementById('transcription-output').innerText = result;
}
