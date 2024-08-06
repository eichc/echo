// JavaScript for handling file upload and recording audio

async function handleFileInput() {
  const formData = new FormData(document.getElementById('upload-form'));
  const response = await fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData
  });
  const result = await response.text();
  document.getElementById('output').innerText = result;
}

let mediaRecorder;
let audioChunks = [];

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audio-playback').src = audioUrl;
      };
      mediaRecorder.start();
      document.getElementById('record-btn').disabled = true;
      document.getElementById('stop-btn').disabled = false;
    });
}

function stopRecording() {
  mediaRecorder.stop();
  document.getElementById('record-btn').disabled = false;
  document.getElementById('stop-btn').disabled = true;
}

async function handleAudioInput() {
  const formData = new FormData();
  const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
  formData.append('file', audioBlob, 'recorded_audio.mp3');
  formData.append('filename', document.getElementById('audio-file-input').value);
  formData.append('format_choice', document.querySelector('input[name="format_choice"]:checked').value);

  const response = await fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: formData
  });
  const result = await response.text();
  document.getElementById('transcription-output').innerText = result;
}

function showSection(sectionId) {
  document.querySelectorAll('main > section').forEach(section => {
    section.style.display = 'none';
  });
  document.querySelector(`.${sectionId}`).style.display = 'block';
}
