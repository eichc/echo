from transcribeaudio import *

audio_file_path = "./audio/EarningsCall.mp3"
transcription = transcribe_audio(audio_file_path)
print(transcription)
#minutes = meeting_minutes(transcription)

#save_as_docx(minutes, './transcriptions/meeting_minutes.docx')