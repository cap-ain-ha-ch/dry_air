# Useless Project 3.0 — Awkward Silence Detector

## What is this?

A deliberately useless tool for video meetings that detects awkward periods of silence and tries to make them even more awkward.

The system monitors incoming audio, measures how long the sound level stays below a user-defined threshold, and increases the awkwardness level as the silence continues.

At the highest level, it interrupts the silence with a sarcastic comment generated using Gemini AI and plays the corresponding voice intervention.

## How it works

1. The user starts microphone monitoring.
2. Meeting/tab audio can be captured through the browser.
3. The Web Audio API measures the incoming sound intensity.
4. If the sound remains below the selected threshold, a silence timer starts.
5. The longer the silence continues, the higher the level becomes.
6. At Level 4, an intervention is triggered.
7. Gemini-generated text is displayed and its corresponding Gemini TTS audio is played.
8. When sound is detected again, the level and timer reset.

### Current levels

| Silence duration | Level                  |
| ---------------- | ---------------------- |
| 0–2 seconds      | Level 0                |
| 2–4 seconds      | Level 1                |
| 4–7 seconds      | Level 2                |
| 7–10 seconds     | Level 3                |
| 10+ seconds      | Level 4 — Intervention |

## Technologies used

* HTML
* CSS
* JavaScript
* Web Audio API
* Node.js
* Express
* Google Gemini API
* Gemini TTS

## AI Integration

Gemini is used for generating short, humorous interventions suitable for awkward meeting situations.

Gemini TTS is used to convert the selected intervention into speech, which is then played through the browser.

The generated audio files are stored locally and matched with their corresponding intervention text to keep the displayed message and spoken message synchronized.

## Development hurdles

### 1. Detecting meeting audio

The browser microphone and meeting/tab audio are separate sources. Browser audio capture was implemented using `getDisplayMedia()` so that meeting/tab audio could be analyzed.

### 2. Gemini model compatibility

The initially selected Gemini model was unavailable for the API configuration being used. A compatible Gemini model was selected after testing the API.

### 3. TTS quota limitations

The Gemini TTS API encountered free-tier quota limitations during development. A separate project/account was eventually used successfully for testing the TTS functionality.

### 4. Audio and generated text mismatch

The first generated audio files came from an earlier batch and did not correspond to the latest generated text array.

This was solved by explicitly matching each stored audio file with its corresponding intervention text.

### 5. WAV file generation

The initial asynchronous WAV file-writing approach caused file-generation conflicts when multiple audio files were generated quickly.

The implementation was changed to construct the WAV header manually and write the resulting buffer directly, avoiding the file-writing race condition.

### 6. API key security

The Gemini API key is stored in a `.env` file and excluded from Git using `.gitignore`.

## Current limitations

* The browser currently plays the intervention through the user's speakers rather than directly injecting it into the meeting microphone.
* Direct microphone injection would require additional audio-routing infrastructure such as a virtual audio device or browser extension.
* The current intervention set is intentionally small for the hackathon demo.

## Project status

The core MVP is working.

The system can:

* Detect silence
* Track silence duration
* Increase the awkwardness level
* Detect Level 4
* Display an intervention
* Play the corresponding Gemini TTS audio
* Reset when sound returns
* Trigger another intervention after a new period of silence

## Why is this useless?

Because nobody asked for it.

And yet, once the silence gets awkward enough, someone has to say something.

## Google Cloud Text-to-Speech Experiment

As a further attempt to improve the intervention system, Google Cloud Text-to-Speech was explored as an alternative to the currently cached Gemini-generated audio.

The `@google-cloud/text-to-speech` Node.js package was successfully installed. However, due to the limited time available during the hackathon, full Google Cloud authentication and integration were not completed.

The current demo therefore continues to use pre-generated WAV files. This keeps the demonstration reliable while leaving the architecture open for future integration with a live cloud TTS service.
