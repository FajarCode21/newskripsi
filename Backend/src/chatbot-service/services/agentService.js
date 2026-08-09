import contextBuilder from "../utils/contextBuilder.js";
import promptBuilder from "../utils/promptBuilder.js";
import toolFormatter from "../utils/toolFormatter.js";

import toolExecutor from "../tools/toolExecutor.js";
import llmService from "./llmService.js";

const MAX_STEPS = 4;

const agentService = {
  process: async ({ user, message, history = [], sessionContext = {} }) => {
    const context = contextBuilder({ user });

    const toolDefs = toolExecutor.getToolDefinitions();
    const tools = toolFormatter(toolDefs);

    const messages = promptBuilder({
      context,
      history,
      message,
      sessionContext,
    });

    let accumulatedContextPatch = {};

    for (let step = 0; step < MAX_STEPS; step++) {
      console.log(`--- AGENT STEP ${step + 1} ---`);

      console.time(`LLM_CALL_STEP_${step + 1}`);
      const response = await llmService.chat({ messages, tools });
      console.timeEnd(`LLM_CALL_STEP_${step + 1}`);

      console.log("LLM RESPONSE:");
      console.dir(response, { depth: null });

      const toolCalls = response.tool_calls || [];

      if (toolCalls.length === 0) {
        return {
          answer:
            response.content?.trim() ||
            "Maaf, saya tidak dapat memproses permintaan ini.",
          contextPatch: accumulatedContextPatch,
        };
      }

      messages.push({
        role: "assistant",
        content: response.content || "",
        tool_calls: toolCalls,
      });

      const results = await Promise.all(
        toolCalls.map(async (call) => {
          const name = call.function?.name;
          let args = call.function?.arguments;

          if (typeof args === "string") {
            try {
              args = JSON.parse(args);
            } catch {
              args = {};
            }
          }

          try {
            console.time(`TOOL_${name}`);
            const result = await toolExecutor.execute(name, args);
            console.timeEnd(`TOOL_${name}`);

            const patch = toolExecutor.extractContext(name, args, result);
            return { name, result, patch, error: null };
          } catch (error) {
            console.error(`Tool "${name}" error:`, error.message);
            return { name, result: null, patch: {}, error: error.message };
          }
        }),
      );

      for (const r of results) {
        accumulatedContextPatch = { ...accumulatedContextPatch, ...r.patch };
      }

      for (const r of results) {
        let content;

        if (r.error) {
          content = `Error executing tool: ${r.error}`;
        } else if (Array.isArray(r.result) && r.result.length === 0) {
          content = "No data found.";
        } else {
          content = JSON.stringify(r.result);
        }

        messages.push({
          role: "tool",
          name: r.name,
          content,
        });
      }
    }

    return {
      answer:
        "Maaf, permintaan ini memerlukan beberapa langkah dan belum bisa diselesaikan. Coba pertanyaan yang lebih spesifik.",
      contextPatch: accumulatedContextPatch,
    };
  },
};

export default agentService;
