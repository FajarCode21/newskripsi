import joi from "joi";

const ticketMaintenanceSchema = {
  PatchAssignTicket: joi.object({
    leader_id: joi.string().required(),
    member_ids: joi.array().items(joi.string()).optional(),
    notes: joi.string().max(500).optional(),
  }),
  PatchSubmitTicket: joi.object({
    description: joi.string().min(10).max(500).required(),
    action_taken: joi.string().min(10).max(500).required(),
    notes: joi.string().max(500).optional(),
    duration_hours: joi.number().positive().precision(2).required(),
  }),
  PatchRejectTicket: joi.object({
    notes: joi.string().min(5).max(500).required(),
  }),
};

export default ticketMaintenanceSchema;
