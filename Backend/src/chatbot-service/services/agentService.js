import contextBuilder from "../utils/contextBuilder.js";
import promptBuilder from "../utils/promptBuilder.js";
import toolFormatter from "../utils/toolFormatter.js";
import resolveMachineReference from "../utils/resolveMachineReference.js";

import toolExecutor from "../tools/toolExecutor.js";
import llmService from "./llmService.js";

const MAX_STEPS = 4;

const agentService = {
  process: async ({ user, message, history = [], sessionContext = {} }) => {
    const context = contextBuilder({ user });

    console.log("================================");
    console.log("CHAT HISTORY:");
    console.log(history);
    console.log("SESSION CONTEXT:");
    console.log(sessionContext);
    console.log("CURRENT MESSAGE:");
    console.log(message);
    console.log("================================");

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

      // arguments harus string saat dikirim balik ke Groq
      messages.push({
        role: "assistant",
        content: response.content || "",
        tool_calls: toolCalls.map((call) => ({
          ...call,
          function: {
            ...call.function,
            arguments:
              typeof call.function.arguments === "string"
                ? call.function.arguments
                : JSON.stringify(call.function.arguments),
          },
        })),
      });

      const results = await Promise.all(
        toolCalls.map(async (call) => {
          const name = call.function?.name;
          const id = call.id;
          let args = call.function?.arguments;

          if (typeof args === "string") {
            try {
              args = JSON.parse(args);
            } catch {
              args = {};
            }
          }

          args = resolveMachineReference(args, sessionContext);

          if (args.__unresolved) {
            return {
              id,
              name,
              result: null,
              patch: {},
              error:
                "Referensi mesin tidak jelas dan belum ada mesin yang dibahas sebelumnya di sesi ini. Tanyakan kepada user kode atau nama mesin yang dimaksud secara eksplisit.",
            };
          }

          try {
            console.time(`TOOL_${name}_${id}`);
            const result = await toolExecutor.execute(name, args, user);
            console.timeEnd(`TOOL_${name}_${id}`);

            const patch = toolExecutor.extractContext(name, args, result);
            return { id, name, result, patch, error: null };
          } catch (error) {
            console.error(`Tool "${name}" error:`, error.message);
            return { id, name, result: null, patch: {}, error: error.message };
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
          tool_call_id: r.id,
          name: r.name,
          content,
        });
      }

      messages.push({
        role: "system",
        content: `
          Now answer the user's ORIGINAL question: "${message}"

          Use ONLY the tool result(s) above to answer directly and naturally.
          Do NOT describe the JSON structure, field names, or data schema.
          Do NOT give generic analysis or suggestions unless the user explicitly asked for insights.
          Answer in the same language the user used in their original question.
          If the result is a list, summarize it clearly (e.g., as a short list or table-like text).
          `,
      });
    }

    return {
      answer:
        "Maaf, permintaan ini memerlukan beberapa langkah dan belum bisa diselesaikan. Coba pertanyaan yang lebih spesifik.",
      contextPatch: accumulatedContextPatch,
    };
  },
};

export default agentService;
