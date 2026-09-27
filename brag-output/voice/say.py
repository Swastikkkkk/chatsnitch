import soundfile as sf, json, sys
from kokoro_onnx import Kokoro
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
voice = sys.argv[1] if len(sys.argv) > 1 else "am_michael"
# (scene start, line) matched to the storyboard
LINES = [
  (0.35, "You clicked Allow on this, right?"),
  (2.7, "That includes your AI chats. Extensions got caught stealing them from millions."),
  (7.9,  "So I built ChatSnitch. It shows every extension that can read your AI chats."),
  (14.3, "Don't trust one? Turn it off."),
  (17.8, "Free, open source, and it never touches the internet."),
]
out = []
for i, (t, text) in enumerate(LINES):
    samples, sr = k.create(text, voice=voice, speed=1.12, lang="en-us")
    sf.write(f"line{i}.wav", samples, sr)
    out.append({"i": i, "start": t, "dur": round(len(samples)/sr, 2), "text": text})
json.dump(out, open("lines.json", "w"), indent=1)
for o in out: print(o["i"], o["start"], o["dur"], "ends", round(o["start"]+o["dur"],2), "|", o["text"])
