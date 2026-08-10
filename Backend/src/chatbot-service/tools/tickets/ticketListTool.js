import { ticketMaintenanceService } from "../../services/pmService.js";

const getMaintenanceTicketsTool = {
  name: "get_maintenance_tickets",
  description:
    "Get list of maintenance tickets. Admins see all tickets; Engineers only see tickets assigned to them.",
  parameters: {
    type: "object",
    properties: {
      status: {
        type: "string",
        description:
          "Filter by status: WaitingAssignment, Assigned, InProgress, WaitingApproval, Done, Rejected.",
      },
      machine: {
        type: "string",
        description: "Filter by machine code or machine name.",
      },
    },
    required: [],
  },
  execute: async ({ status, machine }, user) => {
    if (user.role === "Admin") {
      return await ticketMaintenanceService.listAll({ status, machine });
    }

    return await ticketMaintenanceService.listByAssignedUser(user.id_user, {
      status,
      machine,
    });
  },
};

export default getMaintenanceTicketsTool;
