import { machineService } from "../../services/pmService.js";

const listMachinesTool = {
  name: "list_machines",
  description:
    "Get list of all machines, optionally filtered by status or type.",
  parameters: {
    type: "object",
    properties: {
      status: {
        type: "string",
        description: "Filter by status: Active, Maintenance, or Inactive.",
      },
      type: {
        type: "string",
        description: "Filter by machine type: L, M, or H.",
      },
    },
    required: [],
  },
  execute: async ({ status, type }) => {
    return await machineService.listMachines({ status, type });
  },
};

export default listMachinesTool;
