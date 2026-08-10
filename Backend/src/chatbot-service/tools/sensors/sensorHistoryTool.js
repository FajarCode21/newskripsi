import { dataSensorService } from "../../services/pmService.js";

const getSensorHistoryTool = {
  name: "get_sensor_history",
  description:
    "Get recent sensor reading history for a machine by machine code.",
  parameters: {
    type: "object",
    properties: {
      machine: { type: "string", description: "Machine code or machine name." },
      limit: {
        type: "number",
        description: "Number of latest readings to retrieve (default 10).",
      },
    },
    required: ["machine"],
  },
  execute: async ({ machine, limit }) => {
    return await dataSensorService.getHistoryByMachine(machine, limit || 10);
  },
  extractContext: (args) => ({ lastMachineCode: args.machine }),
};

export default getSensorHistoryTool;
