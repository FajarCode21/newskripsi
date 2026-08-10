import tools from "./index.js";

const toolExecutor = {
  getToolDefinitions: () => {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    }));
  },

  execute: async (name, args, user) => {
    const tool = tools.find((item) => item.name === name);
    if (!tool) {
      throw new Error(`Tool "${name}" tidak ditemukan`);
    }
    return await tool.execute(args || {}, user);
  },

  extractContext: (name, args, result) => {
    const tool = tools.find((item) => item.name === name);
    if (!tool || typeof tool.extractContext !== "function") return {};

    try {
      return tool.extractContext(args, result) || {};
    } catch (error) {
      console.error(`extractContext error untuk tool "${name}":`, error);
      return {};
    }
  },
};

export default toolExecutor;
