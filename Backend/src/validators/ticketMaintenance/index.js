import InvariantError from "../../exceptions/InvariantError.js";
import ticketMaintenanceSchema from "./schema.js";

const ticketMaintenanceValidator = {
  submitPayload: (payload) => {
    const { error } = ticketMaintenanceSchema.submit.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  assignPayload: (payload) => {
    const { error } = ticketMaintenanceSchema.assign.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default ticketMaintenanceValidator;
