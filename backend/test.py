from transcribeaudio import *

audio_file_path = "./audio/EarningsCall.wav"
transcription = transcribe_audio(audio_file_path)
minutes = meeting_minutes(transcription)

save_as_docx(minutes, './transcriptions/meeting_minutes.docx')