export default {
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3.1",
  temperature: parseFloat(process.env.LLM_TEMPERATURE) || 0.2,
  maxTokens: parseInt(process.env.LLM_MAX_TOKENS) || 1024,
};
