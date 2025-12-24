require("dotenv").config();

// Medical system prompt with restrictions
const MEDICAL_SYSTEM_PROMPT = `You are a professional medical information assistant for a healthcare platform. Your role is to provide accurate, helpful medical information while maintaining appropriate boundaries.

CORE RESPONSIBILITIES:
- Answer questions about symptoms, diseases, treatments, medications, medical procedures, and general wellness
- Provide evidence-based medical information in a clear, empathetic manner
- Explain medical concepts in simple terms that patients can understand
- Suggest when to seek professional medical care

STRICT LIMITATIONS:
1. ONLY respond to health and medical-related questions
2. If asked about non-medical topics (sports, entertainment, coding, politics, etc.), politely respond: "I'm a medical assistant designed to help with health-related questions only. Please ask me about symptoms, conditions, treatments, medications, or general health concerns."
3. NEVER diagnose conditions - always say "based on your symptoms" rather than "you have"
4. NEVER provide emergency medical advice - always direct to emergency services for urgent situations
5. NEVER prescribe medications or dosages
6. NEVER replace professional medical advice

DISCLAIMERS (include when relevant):
- "This information is for educational purposes only and should not replace professional medical advice."
- "Please consult a qualified healthcare provider for proper diagnosis and treatment."
- For emergencies: "If this is a medical emergency, please call emergency services immediately or visit the nearest emergency room."

TONE: Professional, empathetic, clear, and supportive.`;

class MedicalChatbot {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    this.model = "llama-3.1-8b-instant"; // Fast and accurate
  }

  async ask(userQuestion) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: MEDICAL_SYSTEM_PROMPT
            },
            {
              role: "user",
              content: userQuestion
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        response: data.choices[0].message.content,
        model: this.model,
        usage: data.usage
      };
    } catch (error) {
      console.error("Medical Chatbot Error:", error.message);
      return {
        success: false,
        error: error.message,
        response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
      };
    }
  }

  // Optional: Change model if needed
  setModel(modelName) {
    this.model = modelName;
  }
}

// Export for use in other files
module.exports = MedicalChatbot;

// // Test function (only runs if this file is executed directly)
// if (require.main === module) {
//   async function runTests() {
//     const chatbot = new MedicalChatbot(process.env.GROQ_API_KEY);

//     console.log("🏥 Medical Chatbot Test\n");
//     console.log("=" .repeat(60));

//     // Test 1: Medical Question
//     console.log("\n📋 TEST 1: Medical Question");
//     console.log("Question: What are the common symptoms of diabetes?");
//     console.log("-".repeat(60));
//     const result1 = await chatbot.ask("What are the common symptoms of diabetes?");
//     console.log(result1.response);
//     console.log(`\n✓ Tokens used: ${result1.usage?.total_tokens || 'N/A'}`);

//     // Test 2: Follow-up Medical Question
//     console.log("\n" + "=".repeat(60));
//     console.log("\n📋 TEST 2: Treatment Question");
//     console.log("Question: How can high fever be treated at home?");
//     console.log("-".repeat(60));
//     const result2 = await chatbot.ask("How can high fever be treated at home?");
//     console.log(result2.response);
//     console.log(`\n✓ Tokens used: ${result2.usage?.total_tokens || 'N/A'}`);

//     // Test 3: Non-Medical Question (Should be rejected)
//     console.log("\n" + "=".repeat(60));
//     console.log("\n📋 TEST 3: Non-Medical Question (Should be rejected)");
//     console.log("Question: Who won the IPL last year?");
//     console.log("-".repeat(60));
//     const result3 = await chatbot.ask("Who won the IPL last year?");
//     console.log(result3.response);
//     console.log(`\n✓ Tokens used: ${result3.usage?.total_tokens || 'N/A'}`);

//     // Test 4: Emergency Situation
//     console.log("\n" + "=".repeat(60));
//     console.log("\n📋 TEST 4: Emergency Question");
//     console.log("Question: My chest hurts badly, what should I do?");
//     console.log("-".repeat(60));
//     const result4 = await chatbot.ask("My chest hurts badly, what should I do?");
//     console.log(result4.response);
//     console.log(`\n✓ Tokens used: ${result4.usage?.total_tokens || 'N/A'}`);

//     console.log("\n" + "=".repeat(60));
//     console.log("\n✅ All tests completed!\n");
//   }

//   runTests();
// }