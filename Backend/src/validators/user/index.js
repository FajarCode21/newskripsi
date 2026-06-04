import InvariantError from "../../exceptions/InvariantError.js";
import userSchema from "./schema.js";

const userValidator = {
  postPayload: (payload) => {
    const { error } = userSchema.post.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  putPayload: (payload) => {
    const { error } = userSchema.put.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default userValidator;
