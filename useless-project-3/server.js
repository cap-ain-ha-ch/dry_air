const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const wav = require("wav");
const fs = require("fs");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

let aiInterventions = [];

app.post("/api/intervention", async (req, res) => {

    try {

        const { silenceSeconds, level } = req.body;

        const prompt = `
You are the AI assistant inside a deliberately useless
awkward-silence detector for a video meeting.

The meeting has been silent for ${silenceSeconds} seconds.
The current awkwardness level is ${level}.

Generate ONE very short intervention that could be spoken
during the meeting.

Style:
- funny
- awkward
- slightly sarcastic
- conversational
- not offensive
- maximum 2 sentences

Do not explain your answer.
Return only the intervention.
`;

       const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
        thinkingConfig: {
            thinkingLevel: "minimal"
        }
    }
});

        res.json({
            intervention: response.text.trim()
        });

  } catch (error) {

    console.error("Gemini error:", error);

    res.status(500).json({
        error: error.message
    });
}
});

app.post("/api/tts", async (req, res) => {
    try {
        const { text } = req.body;
        const { filename } = req.body;

        const response = await ai.interactions.create({
            model: "gemini-3.1-flash-tts-preview",
            input: text,
           response_format: {
    type: "audio"
},
generation_config: {
    speech_config: [
        {
            voice: "Kore"
        }
    ]
}
        });

        if (!response.output_audio) {
    throw new Error("No audio returned by Gemini");
}

const audioBuffer = Buffer.from(
    response.output_audio.data,
    "base64"
);

await new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(`audio/${filename}`, {
        channels: 1,
        sampleRate: 24000,
        bitDepth: 16
    });

    writer.on("finish", resolve);
    writer.on("error", reject);

    writer.write(audioBuffer);
    writer.end();
});

res.json({
    message: `Audio saved as ${filename}`
});

    } catch (error) {
        console.error("TTS error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

function createWavBuffer(pcmData) {
    const sampleRate = 24000;
    const channels = 1;
    const bitDepth = 16;

    const header = Buffer.alloc(44);
    const dataSize = pcmData.length;

    header.write("RIFF", 0);
    header.writeUInt32LE(36 + dataSize, 4);
    header.write("WAVE", 8);

    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * channels * bitDepth / 8, 28);
    header.writeUInt16LE(channels * bitDepth / 8, 32);
    header.writeUInt16LE(bitDepth, 34);

    header.write("data", 36);
    header.writeUInt32LE(dataSize, 40);

    return Buffer.concat([header, pcmData]);
}

app.post("/api/generate-audio", async (req, res) => {
    try {
        if (aiInterventions.length === 0) {
            throw new Error("No AI interventions available");
        }

        for (let i = 0; i < aiInterventions.length; i++) {
            const text = aiInterventions[i];

            const response = await ai.interactions.create({
                model: "gemini-3.1-flash-tts-preview",
                input: text,
                response_format: {
                    type: "audio"
                },
                generation_config: {
                    speech_config: [
                        {
                            voice: "Kore"
                        }
                    ]
                }
            });

            if (!response.output_audio) {
                throw new Error(`No audio returned for intervention ${i + 1}`);
            }

            const audioBuffer = Buffer.from(
                response.output_audio.data,
                "base64"
            );

            const filename = `intervention-${i + 1}.wav`;

            const wavBuffer = createWavBuffer(audioBuffer);

fs.writeFileSync(
    `audio/${filename}`,
    wavBuffer
);
            console.log(`Generated ${filename}`);
        }

        res.json({
            message: "All intervention audio generated"
        });

    } catch (error) {
        console.error("Audio generation error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.post("/api/interventions", async (req, res) => {

    try {

        const prompt = `
Generate 10 short interventions for an awkward-silence detector
used during video meetings.

Each intervention should be:
- funny
- awkward
- slightly sarcastic
- conversational
- not offensive
- maximum 2 sentences

Make each one different.

Return ONLY a JSON array of 10 strings.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingLevel: "minimal"
                }
            }
        });

        aiInterventions =
    JSON.parse(response.text.trim());

       res.json({
    interventions: aiInterventions
});

    } catch (error) {

        console.error("Gemini batch error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});