import joi from "joi";

const ticketMaintenanceSchema = {
  PatchAssignTicket: joi.object({
    leader_id: joi.string().required(),
    member_ids: joi.array().items(joi.string()).optional(),
    notes: joi.string().max(500).optional(),
  }),

  PatchStartTicket: joi.object({
    member_ids: joi.array().items(joi.string()).optional(),
  }),

  PatchManageAssignments: joi
    .object({
      leader_id: joi.string().optional(),
      add_member_ids: joi.array().items(joi.string()).optional(),
      remove_member_ids: joi.array().items(joi.string()).optional(),
    })
    .or("leader_id", "add_member_ids", "remove_member_ids"),

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
