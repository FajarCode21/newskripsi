export default {
  baseUrl: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  temperature: parseFloat(process.env.LLM_TEMPERATURE) || 0.2,
  maxTokens: parseInt(process.env.LLM_MAX_TOKENS) || 1024,
};
