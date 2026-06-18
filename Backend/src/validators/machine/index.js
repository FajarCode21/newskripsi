import machineSchema from "./schema.js";
import InvariantError from "../../exceptions/InvariantError.js";

const machineValidator = {
  postMachinePayload: (payload) => {
    const { error } = machineSchema.postMachine.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  putMachinePayload: (payload) => {
    const { error } = machineSchema.putMachine.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default machineValidator;
