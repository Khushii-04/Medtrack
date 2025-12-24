const MedicalChatbot = require("../services/groqAiService");

// Create chatbot instance once for better performance
const chatbot = new MedicalChatbot(process.env.GROQ_API_KEY);

const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validate input
    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        error: 'Message is required',
        reply: 'Please enter a message.'
      });
    }

    // Limit message length
    if (message.length > 500) {
      return res.status(400).json({ 
        error: 'Message too long',
        reply: 'Please keep your message under 500 characters.'
      });
    }

    console.log("📹 Incoming message:", message);

    // Get chatbot response
    const result = await chatbot.ask(message);
    
    // Check if request was successful
    if (!result.success) {
      console.error("❌ Chatbot error:", result.error);
      return res.status(500).json({ 
        error: result.error,
        reply: result.response 
      });
    }

    // Return successful response
    res.json({ 
      reply: result.response,
      model: result.model,
      tokensUsed: result.usage?.total_tokens
    });

  } catch (error) {
    console.error("❌ Chat error:", error.message);
    console.error("Stack trace:", error.stack);

    // Handle specific error types
    if (error.name === 'AbortError') {
      return res.status(408).json({
        error: 'Request timeout',
        reply: "The request took too long. Please try again."
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to process message',
      reply: "I'm having trouble connecting right now. Please try again later."
    });
  }
};

module.exports = { handleChatMessage };