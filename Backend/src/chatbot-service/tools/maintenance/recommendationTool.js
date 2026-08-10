import { maintenanceRecommendationService } from "../../services/pmService.js";

const getMaintenanceRecommendationTool = {
  name: "get_maintenance_recommendation",
  description:
    "Get latest RUL (Remaining Useful Life) prediction and maintenance recommendation for a machine.",
  parameters: {
    type: "object",
    properties: {
      machine: { type: "string", description: "Machine code or machine name." },
    },
    required: ["machine"],
  },
  execute: async ({ machine }) => {
    return await maintenanceRecommendationService.getLatestByMachine(machine);
  },
  extractContext: (args) => ({ lastMachineCode: args.machine }),
};

export default getMaintenanceRecommendationTool;
