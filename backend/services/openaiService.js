const OpenAI = require('openai');
require("dotenv").config({ path: "../.env" });
// console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

async function callGPT(promptContent, systemContent, previousChat) {
  try {
    const messages = [];

    const userPrompt = {
      role: "user",
      content: promptContent,
    };
    const systemPrompt = {
      role: "system",
      content: systemContent,
    };
    const assistantPrompt = {
      role: "assistant",
      content: previousChat,
    };

    messages.push(userPrompt);
    messages.push(systemPrompt);
    messages.push(assistantPrompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      //   model: "gpt-3.5-turbo",
      messages: messages,
    });

    console.log(1);
    console.log(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return `An error occurred while processing the request: ${error}`;
  }
}

module.exports = { callGPT };
