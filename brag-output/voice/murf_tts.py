# Murf TTS (Nikhil, en-IN, FALCON). Key is read from the environment, never committed.
# Usage: set MURF_API_KEY (see C:\Users\swast\Projects\.secrets\murf.env), then:
#   python murf_tts.py lines.json [rate]
import os, sys, json, urllib.request
KEY = os.environ["MURF_API_KEY"]
def tts(text, out, voice="en-IN-nikhil", rate=0, pitch=0):
    body = json.dumps({"text": text, "voiceId": voice, "model": "FALCON", "format": "WAV",
                       "sampleRate": 48000, "rate": rate, "pitch": pitch}).encode()
    req = urllib.request.Request("https://api.murf.ai/v1/speech/stream", body,
          {"api-key": KEY, "Content-Type": "application/json"})
    open(out, "wb").write(urllib.request.urlopen(req).read())
if __name__ == "__main__":
    lines = json.load(open(sys.argv[1]))
    for i, t in enumerate(lines, 1):
        tts(t, f"m{i}.wav", rate=int(sys.argv[2]) if len(sys.argv) > 2 else 0)
