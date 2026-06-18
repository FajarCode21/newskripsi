import joi from "joi";

const authenticationSchema = {
  postUser: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
  }),

  putAuthentication: joi.object({
    refreshToken: joi.string().required(),
  }),

  deleteAuthentication: joi.object({
    refreshToken: joi.string().required(),
  }),
};

export default authenticationSchema;
