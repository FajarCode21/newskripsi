import InvariantError from "../../exceptions/InvariantError.js";
import ticketMaintenanceSchema from "./schema.js";

const ticketMaintenanceValidator = {
  patchSubmitTicketPayload: (payload) => {
    const { error } =
      ticketMaintenanceSchema.PatchSubmitTicket.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  patchAssignTicketPayload: (payload) => {
    const { error } =
      ticketMaintenanceSchema.PatchAssignTicket.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default ticketMaintenanceValidator;
