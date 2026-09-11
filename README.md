<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# Dry Air 🎯


## Basic Details
### Team Name: ENOMEM


### Team Members
- Team Lead: Sehal Santhosh - Government Engineering College, Kozhikode

### Project Description
A deliberately useless tool for video meetings that detects awkward periods of silence and tries to make them even more awkward.

The system monitors incoming audio, measures how long the sound level stays below a user-defined threshold, and increases the awkwardness level as the silence continues.

At the highest level, it interrupts the silence with a sarcastic comment generated using Gemini AI and plays the corresponding voice intervention.

### The Problem (that doesn't exist)
Nobody has spoken in a video meeting for too long, and apparently we need AI to panic about it.

### The Solution (that nobody asked for)
Dry Air monitors incoming meeting audio, detects prolonged silence using the microphone, increases an Awkwardness Level as the silence continues, and uses AI-generated interventions to break the silence.

## Technical Details
### Technologies/Components Used
For Software:
- JavaScript, HTML, CSS
- Node.js, Express.js
- Google GenAI SDK (@google/genai), Web Audio API
- Visual Studio Code, Git, GitHub, Google Gemini API, Gemini TTS

For Hardware:
- N/A

### Implementation
For Software:
# Installation
- git clone https://github.com/cap-ain-ha-ch/useless-project-3.git
- cd useless-project-3
- npm install


# Run
- node server.js
- - http://localhost:3000


### Project Documentation
For Software:

# Screenshots 
<img width="1583" height="970" alt="image" src="https://github.com/user-attachments/assets/01e3a861-7b9a-49d0-8ecb-1a6908bf2944" />
Dry Air Home page

<img width="1652" height="968" alt="Screenshot 2026-09-12 045933" src="https://github.com/user-attachments/assets/492adb0a-78ff-43ac-9734-5b92eaad8441" />
Increasing level of silence

<img width="1552" height="966" alt="image" src="https://github.com/user-attachments/assets/d1d34e9a-1c84-455c-b76b-7fc79c48074b" />
At level 4, The website plays a cached gemini ai voice response

# Diagrams
<img width="1408" height="768" alt="Gemini_Generated_Image_h7g9z6h7g9z6h7g9" src="https://github.com/user-attachments/assets/59640fc3-8b3e-4d13-86d7-ef91c78cfcfe" />
Workflow of Dry Air, from meeting audio capture and silence detection to AI intervention.


### Project Demo
# Video
https://drive.google.com/drive/folders/1TxKKP1YQg-yBrHS3s4AOlryczsXTad1R?usp=drive_link
- Demonstration of the Dry Air web application detecting prolonged silence in a video meeting, progressively increasing the awkwardness level, and triggering an AI-generated intervention when the silence threshold is reached.

# Deployed website link
- https://useless-project-3-hu7h.onrender.com/


## Team Contributions
- Sehal Santhosh: Built this from ground up with the help of chat gpt

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)



