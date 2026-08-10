import axios from "axios";
import llmConfig from "../config/llmConfig.js";

const llmService = {
  chat: async ({ messages, tools = [] }) => {
    const payload = {
      model: llmConfig.model,
      messages,
      temperature: llmConfig.temperature,
      max_tokens: llmConfig.maxTokens,
    };

    if (tools.length > 0) {
      payload.tools = tools;
    }

    try {
      const { data } = await axios.post(
        `${llmConfig.baseUrl}/chat/completions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${llmConfig.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      const message = data.choices[0].message;

      if (message.tool_calls) {
        message.tool_calls = message.tool_calls.map((call) => ({
          ...call,
          function: {
            ...call.function,
            arguments:
              typeof call.function.arguments === "string"
                ? JSON.parse(call.function.arguments)
                : call.function.arguments,
          },
        }));
      }

      return message;
    } catch (error) {
      // ===========================
      // Log detail error asli dari Groq
      // ===========================
      console.error("GROQ ERROR STATUS:", error.response?.status);
      console.error(
        "GROQ ERROR DATA:",
        JSON.stringify(error.response?.data, null, 2),
      );
      console.error("GROQ REQUEST PAYLOAD:", JSON.stringify(payload, null, 2));
      throw error;
    }
  },
};

export default llmService;
