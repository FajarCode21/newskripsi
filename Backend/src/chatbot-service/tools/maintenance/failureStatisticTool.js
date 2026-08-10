import { failureStatisticService } from "../../services/pmService.js";

const getFailureStatisticsTool = {
  name: "get_failure_statistics",
  description:
    "Get latest failure prediction statistics (confidence, failure type breakdown) for a machine.",
  parameters: {
    type: "object",
    properties: {
      machine: { type: "string", description: "Machine code or machine name." },
    },
    required: ["machine"],
  },
  execute: async ({ machine }) => {
    return await failureStatisticService.getLatestByMachine(machine);
  },
  extractContext: (args) => ({ lastMachineCode: args.machine }),
};

export default getFailureStatisticsTool;
