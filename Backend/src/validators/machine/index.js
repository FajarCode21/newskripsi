import machineSchema from "./schema.js";
import InvariantError from "../../exceptions/InvariantError.js";

const machineValidator = {
  postPayload: (payload) => {
    const { error } = machineSchema.post.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  putPayload: (payload) => {
    const { error } = machineSchema.put.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default machineValidator;
