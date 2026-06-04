import joi from "joi";

const authenticationSchema = {
  postUser: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
  }),

  put: joi.object({
    refreshToken: joi.string().required(),
  }),

  delete: joi.object({
    refreshToken: joi.string().required(),
  }),
};

export default authenticationSchema;
