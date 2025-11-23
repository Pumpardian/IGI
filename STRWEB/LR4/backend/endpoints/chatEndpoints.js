const authToken = require("../middleware/authMiddleware.js");
const dotenv = require('dotenv');

dotenv.config();

module.exports = app => {
    var router = require("express").Router();

    router.post("/", authToken, async (request, response) => {
        try {
            const { message } = request.body;
            
            queryHuggingFace({
                messages: [{
                        role: "user",
                        content: message,
                        //text: message,
                        //past_user_inputs: conversation_history.slice(-4).filter((_, i) => i % 2 === 0),
                        //generated_responses: conversation_history.slice(-4).filter((_, i) => i % 2 === 1)
                    },
                ],
                model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
            }).then((res) => {
                response.send({
                    success: true,
                    bot_message: res.choices[0].message.content,
                    conversation_id: Date.now()
                });
            });
        } catch (err) {
            console.error('Error calling Hugging Face API:', err);
            response.status(500).send({
                success: false,
                error: "Error while handling request",
                bot_message: "Im currently busy..."
            });
        }
    });

    async function queryHuggingFace(data) {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    }

    app.use('/api/chat', router);
}