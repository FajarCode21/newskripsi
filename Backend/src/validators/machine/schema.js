import joi from "joi";

const machineSchema = {
  post: joi.object({
    name: joi.string().min(3).max(100).required(),
    code: joi.string().min(3).max(50).required(),
    type: joi.string().valid("L", "M", "H").required(),
    location: joi.string().min(3).max(255).required(),
    install_date: joi.date().iso().required(),
  }),

  put: joi.object({
    name: joi.string().min(3).max(100).required(),
    code: joi.string().min(3).max(50).required(),
    type: joi.string().valid("L", "M", "H").required(),
    location: joi.string().min(3).max(255).required(),
    install_date: joi.date().iso().required(),
  }),
};

export default machineSchema;
