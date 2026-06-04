import InvariantError from "../../exceptions/InvariantError.js";
import authenticationSchema from "./schema.js";

const authenticationValidator = {
  postUserPayload: (payload) => {
    const { error } = authenticationSchema.postUser.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  putPayload: (payload) => {
    const { error } = authenticationSchema.put.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  deletePayload: (payload) => {
    const { error } = authenticationSchema.delete.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default authenticationValidator;
