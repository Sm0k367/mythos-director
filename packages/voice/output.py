# Voice Output Module

Agents can speak back using ElevenLabs (production) or local TTS (offline).

## Usage

```python
from packages.voice.output import speak

await speak("Task completed. 3 files changed. Ready for review.", voice="mythos")
```

## Offline Mode

Uses system TTS (pyttsx3 on Windows, say on macOS) when no API key is present.
