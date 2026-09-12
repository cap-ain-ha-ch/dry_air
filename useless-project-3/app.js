const startButton = document.getElementById("startButton");
const meetingButton = document.getElementById("meetingButton");

const status = document.getElementById("status");
const timer = document.getElementById("timer");
const intervention = document.getElementById("intervention");

const thresholdSlider = document.getElementById("threshold");
const thresholdValue = document.getElementById("thresholdValue");
const levelDisplay = document.getElementById("level");

let aiInterventions = [
    "Well, this is comfortably uncomfortable. Should we all just pretend to look deeply thoughtful for another 30 seconds?",
    "Did everyone freeze? Or is this just the part of the meeting where we question our life choices in silence?"
];
let audioContext;
let analyser;
let dataArray;

let silenceStart = null;
let interventionTriggered = false;


// Update threshold display
thresholdSlider.addEventListener("input", () => {
    thresholdValue.textContent = thresholdSlider.value;
});


// ============================
// MICROPHONE MODE
// ============================

startButton.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        startMonitoring(stream);

        startButton.disabled = true;
        meetingButton.disabled = true;

    } catch (error) {

        console.error(error);

        status.textContent =
            "Microphone access was denied.";
    }
});


// ============================
// MEETING / TAB AUDIO MODE
// ============================

meetingButton.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

        // We only need the audio track
        startMonitoring(stream);

        meetingButton.disabled = true;
        startButton.disabled = true;

        status.textContent =
            "Monitoring meeting audio...";

    } catch (error) {

        console.error(error);

        status.textContent =
            "Meeting audio capture was cancelled.";
    }
});


// ============================
// START AUDIO ANALYSIS
// ============================

function startMonitoring(stream) {

    audioContext = new AudioContext();

    const source =
        audioContext.createMediaStreamSource(stream);

    analyser =
        audioContext.createAnalyser();

    analyser.fftSize = 512;

    dataArray =
        new Uint8Array(analyser.fftSize);

    source.connect(analyser);

    status.textContent =
        "Monitoring...";

    detectSound();
}


// ============================
// ANALYZE AUDIO
// ============================

function detectSound() {

    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;

    for (let i = 0; i < dataArray.length; i++) {

        const value =
            dataArray[i] - 128;

        sum += value * value;
    }

    const volume =
        Math.sqrt(sum / dataArray.length);

    const threshold =
        Number(thresholdSlider.value);

    const isSilent =
        volume < threshold;


    if (isSilent) {

        if (silenceStart === null) {

            silenceStart = Date.now();
        }

        const silenceTime =
            Math.floor(
                (Date.now() - silenceStart) / 1000
            );

        timer.textContent =
            `Silence: ${silenceTime}s`;

        updateLevel(silenceTime);

    } else {

        silenceStart = null;
        interventionTriggered = false;
        document.body.classList.remove("intervention-mode");

        timer.textContent =
            "Silence: 0s";

        levelDisplay.textContent =
            "Level 0";

        status.textContent =
            "Someone is talking...";

        intervention.textContent =
            "";
    }

    requestAnimationFrame(detectSound);
}


// ============================
// LEVEL SYSTEM
// ============================

function updateLevel(seconds) {

    let level;

    if (seconds < 2) {

        level = 0;

        status.textContent =
            "Normal";

    } else if (seconds < 4) {

        level = 1;

        status.textContent =
            "Getting quiet...";

    } else if (seconds < 7) {

        level = 2;

        status.textContent =
            "Awkward silence detected.";

    } else if (seconds < 10) {

        level = 3;

        status.textContent =
            "This is becoming uncomfortable.";

    } else {

    level = 4;

    status.textContent =
        "INTERVENTION REQUIRED";

    document.body.classList.add("intervention-mode");

    triggerIntervention();
}

    levelDisplay.textContent =
        `Level ${level}`;
}
async function loadAIInterventions() {

    try {

        const response = await fetch("/api/interventions", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Failed to load AI interventions");
        }

        const data = await response.json();

        aiInterventions = data.interventions;

        console.log("AI interventions loaded:", aiInterventions);

    } catch (error) {

        console.error("AI preload failed:", error);

    }
}

// ============================
// INTERVENTION
// ============================

 function triggerIntervention() {
    if (interventionTriggered) {
        return;
    }

    interventionTriggered = true;

    const randomIndex =
        Math.floor(Math.random() * aiInterventions.length);

    intervention.textContent =
        aiInterventions[randomIndex];

    const audio = new Audio(
        `/audio/intervention-${randomIndex + 1}.wav`
    );

    audio.play();
}
//loadAIInterventions();