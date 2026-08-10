import { dataSensorService } from "../../services/pmService.js";

const getLatestSensorTool = {
  name: "get_latest_sensor",
  description:
    "Get the most recent sensor reading for a machine by machine code.",
  parameters: {
    type: "object",
    properties: {
      machine: { type: "string", description: "Machine code or machine name." },
    },
    required: ["machine"],
  },
  execute: async ({ machine }) => {
    return await dataSensorService.getLatestByMachine(machine);
  },
  extractContext: (args) => ({ lastMachineCode: args.machine }),
};

export default getLatestSensorTool;
