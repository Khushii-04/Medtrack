require("dotenv").config();

const MEDICAL_SYSTEM_PROMPT = `You are a medical information assistant. Your role is to provide helpful, accurate medical information and health-related guidance.

STRICT RULES:
1. ONLY answer questions related to medicine, health, symptoms, diseases, treatments, medications, medical procedures, or general wellness.
2. If asked about non-medical topics (sports, politics, entertainment, coding, etc.), politely decline and say: "I'm a medical assistant and can only help with health and medical-related questions. Please ask me about symptoms, conditions, treatments, or general health concerns."
3. Always include a disclaimer: "This information is for educational purposes only. Please consult a healthcare professional for medical advice."
4. Never provide emergency medical advice. For emergencies, always tell users to call emergency services or visit a hospital immediately.
5. Be empathetic, clear, and concise in your responses.`;

async function askMedicalQuestion(userQuestion) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `${MEDICAL_SYSTEM_PROMPT}\n\nUser Question: ${userQuestion}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("HF API Error:", data.error);
      return "I'm sorry, I encountered an error. Please try again.";
    }

    return data[0].generated_text.trim();
  } catch (err) {
    console.error("Error:", err.message);
    return "I'm sorry, I encountered an error. Please try again.";
  }
}

// Test with medical question
async function testMedical() {
  console.log("=== MEDICAL QUESTION ===");
  const medicalResponse = await askMedicalQuestion("What causes fever and how can I reduce it?");
  console.log(medicalResponse);
  console.log("\n");
}

// Test with non-medical question
async function testNonMedical() {
  console.log("=== NON-MEDICAL QUESTION ===");
  const nonMedicalResponse = await askMedicalQuestion("Who won the cricket world cup?");
  console.log(nonMedicalResponse);
  console.log("\n");
}

// Run tests
async function runTests() {
  await testMedical();
  await testNonMedical();
}

runTests();