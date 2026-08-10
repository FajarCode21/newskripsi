import { machineService } from "../../services/pmService.js";

const getMachineInfoTool = {
  name: "get_machine_info",
  description:
    "Get machine information (status, location, type, install date) by machine code or machine name.",
  parameters: {
    type: "object",
    properties: {
      machine: {
        type: "string",
        description: "Machine code or machine name.",
      },
    },
    required: ["machine"],
  },
  execute: async ({ machine }) => {
    return await machineService.getAllMachines(machine);
  },
  extractContext: (args, result) => {
    const machineData = Array.isArray(result) ? result[0] : result;
    if (!machineData?.code) return {};

    return {
      lastMachineCode: machineData.code,
      lastMachineName: machineData.name,
    };
  },
};

export default getMachineInfoTool;
