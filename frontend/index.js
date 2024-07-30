let mediaRecorder;
let audioChunks = [];
let pyodidePromise = null;

async function getPyodideInstance() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide();
  }
  return pyodidePromise;
}


async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };
  mediaRecorder.start();
  document.getElementById("record-btn").disabled = true;
  document.getElementById("stop-btn").disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    audioChunks = [];
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = document.getElementById("audio-playback");
    audio.src = audioUrl;
    const arrayBuffer = await audioBlob.arrayBuffer();
    const pyodide = await getPyodideInstance();
    pyodide.globals.set("arrayBuffer", arrayBuffer);
    await pyodide.runPythonAsync(`
      import js
      import pyodide
      import backend.transcribeaudio as ta

      arrayBuffer_ = js.arrayBuffer.to_py()
      
      with open("recorded_audio.mp3", "wb") as f:
        f.write(arrayBuffer_)
    `);
  };
  document.getElementById("record-btn").disabled = false;
  document.getElementById("stop-btn").disabled = true;
}

function showSection(sectionClass) {
  const sections = document.querySelectorAll("main section");
  sections.forEach((section) => {
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
  const wavInput = document.getElementById("mp3-input").files[0];
  if (!wavInput) {
    alert("Please select an audio file.");
    return;
  }
  const filename = document.getElementById("file-input").value;
  const formatChoice = document.querySelector(
    'input[name="doc-format"]:checked'
  ).value;
  const arrayBuffer = await wavInput.arrayBuffer();
  const pyodide = await getPyodideInstance();
  pyodide.globals.set("arrayBuffer", arrayBuffer);
  pyodide.globals.set("filename", filename);
  pyodide.globals.set("formatChoice", formatChoice);
  await pyodide.runPythonAsync(
    `
          from js import document
          from backend.transcribeaudio import transcribe_audio, meeting_minutes, save_as_docx, save_as_pdf
          
          arrayBuffer_ = js.arrayBuffer.to_py()
          filename_ = js.filename.to_py()
          formatChoice_ = js.formatChoice.to_py()
          def handleFileInput(arrayBuffer, filename, formatChoice):
            result = transcribe_audio(arrayBuffer)
            minutes = meeting_minutes(result)
            if formatChoice == "docx":
              save_as_docx(minutes, filename + ".docx")
            elif formatChoice == "pdf":
              save_as_pdf(minutes, filename + ".pdf")
            document.getElementById("output").innerText = "Document saved as " + filename + "." + formatChoice
          handleFileInput(to_js(arrayBuffer), filename, formatChoice)
        `,
    { arrayBuffer, filename, formatChoice }
  );
}

async function handleAudioInput() {
  const filename = document.getElementById("audio-file-input").value;
  const formatChoice = document.querySelector(
    'input[name="audio-doc-format"]:checked'
  ).value;
  const pyodide = await getPyodideInstance();
  pyodide.globals.set("filename", filename);
  pyodide.globals.set("formatChoice", formatChoice);
  await pyodide.runPythonAsync(
    `
          from js import document
          from backend.transcribeaudio import transcribe_audio, meeting_minutes, save_as_docx, save_as_pdf
          
          filename_ = js.filename.to_py()
          formatChoice_ = js.formatChoice.to_py()
          def handleAudioInput(filename, formatChoice):
            result = transcribe_audio("recorded_audio.mp3")
            minutes = meeting_minutes(result)
            if formatChoice == "docx":
              save_as_docx(minutes, filename + ".docx")
            elif formatChoice == "pdf":
              save_as_pdf(minutes, filename + ".pdf")
            document.getElementById("transcription-output").innerText = "Document saved as " + filename + "." + formatChoice
          handleAudioInput(filename, formatChoice)
        `,
    { filename, formatChoice }
  );
}