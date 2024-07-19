from transcribeaudio import *

#audio_file_path = "./audio/EarningsCall.mp3"
#transcription = transcribe_audio(audio_file_path)
#print(transcription)
#minutes = meeting_minutes(transcription)

transcription = "Good afternoon, everyone, and welcome to Fintech Plus Sync's 2nd quarter 2023 earnings call. I'm John Doe, CEO of Fintech Plus. We've had a stellar Q2 with a revenue of $125 million, a 25% increase year over year. Our gross profit margin stands at a solid 58%, due in part to cost efficiencies gained from our scalable business model. Our EBITDA has surged to $37.5 million, translating to a remarkable 30% EBITDA margin. Our net income for the quarter rose to $16 million, which is a noteworthy increase from $10 million in Q2 2022. Our total addressable market has grown substantially, thanks to the expansion of our high-yield savings product line and the new RoboAdvisor platform. We've been diversifying our asset-backed securities portfolio, investing heavily in collateralized debt obligations and residential mortgage-backed securities. We've also invested $25 million in AAA-rated corporate bonds, enhancing our risk-adjusted returns. As for our balance sheet, total assets reached $1.5 billion, with total liabilities at $900 million, leaving us with a solid equity base of $600 million. Our debt-to-equity ratio stands at 1.5, a healthy figure considering our expansionary phase. We continue to see substantial organic user growth, with customer acquisition costs dropping by 15% and lifetime value growing by 25%. Our LTVCAC ratio is at an impressive 3.5%. In terms of risk management, we have a value-at-risk model in place, with a 99% confidence level indicating that our maximum loss will not exceed $5 million in the next trading day. We've adopted a conservative approach to managing our leverage, and have a healthy tier-one capital ratio of 12.5%. Our forecast for the coming quarter is positive. We expect revenue to be around $135 million and 8% quarter-over-quarter growth, driven primarily by our cutting-edge blockchain solutions and AI-driven predictive analytics. We're also excited about the upcoming IPO of our fintech subsidiary, Pay Plus, which we expect to raise $200 million, significantly bolstering our liquidity and paving the way for aggressive growth strategies. We thank our shareholders for their continued faith in us, and we look forward to an even more successful Q3. Thank you so much."
minutes = {'transcription': transcription}
save_as_docx(minutes, './transcriptions/meeting_minutes.docx')

#testing chatgpt functions
#actionItems = action_item_extraction(transcription)
#print(actionItems)



#sentiment = sentiment_analysis(transcription)
#print(sentiment)

