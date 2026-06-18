import InvariantError from "../../exceptions/InvariantError.js";
import userSchema from "./schema.js";

const userValidator = {
  postUserPayload: (payload) => {
    const { error } = userSchema.postUser.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  putUserPayload: (payload) => {
    const { error } = userSchema.putUser.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default userValidator;
