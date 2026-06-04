import joi from "joi";

const userSchema = {
  post: joi.object({
    employee_id: joi.string().min(3).max(50).required(),
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    role: joi.string().valid("Admin", "Engineer").required(),
  }),

  put: joi.object({
    name: joi.string().min(3).max(50).required(),
    password: joi.string().min(6).max(100).required(),
    role: joi.string().valid("Admin", "Engineer").optional(),
  }),
};

export default userSchema;
