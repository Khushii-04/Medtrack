const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MEDICAL_SYSTEM_PROMPT = `
You are a medical assistant for MEDTrack.

Rules:
- Answer ONLY medical, health, medication, symptoms, or wellness-related questions.
- If the question is NOT medical, politely refuse.
- Do not diagnose or prescribe.
- Encourage consulting a doctor when needed.
`;

async function generateReply(userMessage) {
  const result = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [
      { role: "user", parts: [{ text: MEDICAL_SYSTEM_PROMPT + "\n\nUser question: " + userMessage }] }
    ]
  });

  return result.text;
}

module.exports = { generateReply };