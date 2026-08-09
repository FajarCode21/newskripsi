import systemPrompt from "../prompts/systemPrompt.js";

const promptBuilder = ({
  context,
  history = [],
  message,
  sessionContext = {},
}) => {
  const contextLines = [];

  if (sessionContext.lastMachineCode) {
    contextLines.push(
      `- Last discussed machine: ${sessionContext.lastMachineCode}` +
        (sessionContext.lastMachineName
          ? ` (${sessionContext.lastMachineName})`
          : ""),
    );
  }

  const sessionContextBlock =
    contextLines.length > 0
      ? `\nSESSION CONTEXT:\n${contextLines.join("\n")}\n`
      : "";

  const messages = [
    {
      role: "system",
      content: `${systemPrompt}\n\nCURRENT USER:\n${JSON.stringify(context)}\n${sessionContextBlock}`,
    },
  ];

  for (const item of history) {
    if (
      ["user", "assistant"].includes(item.role) &&
      typeof item.content === "string"
    ) {
      messages.push({ role: item.role, content: item.content });
    }
  }

  messages.push({ role: "user", content: message });

  return messages;
};

export default promptBuilder;
