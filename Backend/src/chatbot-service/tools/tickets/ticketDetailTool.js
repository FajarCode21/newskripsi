import { ticketMaintenanceService } from "../../services/pmService.js";

const getTicketDetailTool = {
  name: "get_ticket_detail",
  description: "Get full detail of a specific maintenance ticket by ticket ID.",
  parameters: {
    type: "object",
    properties: {
      ticketId: { type: "number", description: "The maintenance ticket ID." },
    },
    required: ["ticketId"],
  },
  execute: async ({ ticketId }, user) => {
    const ticket = await ticketMaintenanceService.getDetailById(ticketId);

    if (!ticket) {
      return [];
    }

    if (user.role === "Admin") {
      return [ticket];
    }

    const isAssigned = await ticketMaintenanceService.isUserAssigned(
      ticketId,
      user.id_user,
    );

    if (!isAssigned) {
      return {
        _restricted: true,
        message:
          "Anda tidak memiliki akses ke ticket ini karena bukan ticket yang di-assign kepada Anda.",
      };
    }

    return [ticket];
  },
};

export default getTicketDetailTool;
