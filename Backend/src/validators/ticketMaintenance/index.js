import InvariantError from "../../exceptions/InvariantError.js";
import ticketMaintenanceSchema from "./schema.js";

const ticketMaintenanceValidator = {
  patchAssignTicketPayload: (payload) => {
    const { error } =
      ticketMaintenanceSchema.PatchAssignTicket.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
  },

  patchStartTicketPayload: (payload) => {
    const { error } =
      ticketMaintenanceSchema.PatchStartTicket.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
  },

  patchManageAssignmentsPayload: (payload) => {
    const { error } =
      ticketMaintenanceSchema.PatchManageAssignments.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
  },

  patchSubmitTicketPayload: (payload) => {
    const { error } =
      ticketMaintenanceSchema.PatchSubmitTicket.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
  },

  patchRejectTicketPayload: (payload) => {
    const { error } =
      ticketMaintenanceSchema.PatchRejectTicket.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default ticketMaintenanceValidator;
