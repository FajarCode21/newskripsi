import joi from "joi";

const ticketMaintenanceSchema = {
  PatchAssignTicket: joi.object({
    assigned_engineer_id: joi.string().required(),
  }),
  PatchSubmitTicket: joi.object({
    description: joi.string().min(10).max(500).required(),
    action_taken: joi.string().min(10).max(500).required(),
    notes: joi.string().max(500).optional(),
    duration_hours: joi.number().positive().precision(2).required(),
  }),
};

export default ticketMaintenanceSchema;
