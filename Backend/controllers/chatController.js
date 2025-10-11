// controllers/chatController.js
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful medical assistant for MEDTrack, a medication management app. You help users with medication reminders, tracking adherence, and answering general questions about their medication schedules. Be supportive, professional, and provide general health information. Always remind users to consult their healthcare provider for medical advice, especially regarding side effects or missed doses."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 300,
            temperature: 0.7
        });

        const reply = completion.choices[0].message.content;

        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        
        // Handle specific OpenAI errors
        if (error.status === 401) {
            return res.status(500).json({ 
                error: 'API authentication failed',
                reply: "I'm having trouble connecting right now. Please contact support."
            });
        }
        
        if (error.status === 429) {
            return res.status(500).json({ 
                error: 'Rate limit exceeded',
                reply: "I'm experiencing high demand right now. Please try again in a moment."
            });
        }

        res.status(500).json({ 
            error: 'Failed to process message',
            reply: "I'm having trouble connecting right now. Please try again later."
        });
    }
};

module.exports = {
    handleChatMessage
};