import InvariantError from "../../exceptions/InvariantError.js";
import authenticationSchema from "./schema.js";

const authenticationValidator = {
  postUserPayload: (payload) => {
    const { error } = authenticationSchema.postUser.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  putAuthenticationPayload: (payload) => {
    const { error } = authenticationSchema.putAuthentication.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  deleteAuthenticationPayload: (payload) => {
    const { error } =
      authenticationSchema.deleteAuthentication.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default authenticationValidator;
