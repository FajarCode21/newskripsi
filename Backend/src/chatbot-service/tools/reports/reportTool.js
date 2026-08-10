import {
  maintenanceReportService,
  ticketMaintenanceService,
} from "../../services/pmService.js";

const getMaintenanceReportTool = {
  name: "get_maintenance_report",
  description:
    "Get the maintenance report (description, action taken, duration) for a specific ticket ID.",
  parameters: {
    type: "object",
    properties: {
      ticketId: { type: "number", description: "The maintenance ticket ID." },
    },
    required: ["ticketId"],
  },
  execute: async ({ ticketId }, user) => {
    if (user.role !== "Admin") {
      const isAssigned = await ticketMaintenanceService.isUserAssigned(
        ticketId,
        user.id_user,
      );
      if (!isAssigned) {
        return {
          _restricted: true,
          message: "Anda tidak memiliki akses ke laporan ticket ini.",
        };
      }
    }

    return await maintenanceReportService.getByTicketId(ticketId);
  },
};

export default getMaintenanceReportTool;
