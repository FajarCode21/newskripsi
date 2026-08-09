import axios from "axios";
import llmConfig from "../config/llmConfig.js";

const llmService = {
  chat: async ({ messages, tools = [] }) => {
    const payload = {
      model: llmConfig.model,
      messages,
      stream: false,
      options: {
        temperature: llmConfig.temperature,
        num_predict: llmConfig.maxTokens,
      },
    };

    if (tools.length > 0) {
      payload.tools = tools;
    }

    const { data } = await axios.post(`${llmConfig.baseUrl}/api/chat`, payload);

    // data.message = { role: "assistant", content: "...", tool_calls?: [...] }
    return data.message;
  },
};

export default llmService;
