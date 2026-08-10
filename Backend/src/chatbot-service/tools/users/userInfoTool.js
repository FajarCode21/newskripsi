import { userService } from "../../services/pmService.js";

const getUserInfoTool = {
  name: "get_user_info",
  description:
    "Get information about a system user by employee ID, name, or email. Admin access only.",
  parameters: {
    type: "object",
    properties: {
      identifier: {
        type: "string",
        description: "Employee ID, name, or email of the user.",
      },
    },
    required: ["identifier"],
  },
  execute: async ({ identifier }, user) => {
    if (user.role !== "Admin") {
      return {
        _restricted: true,
        message: "Hanya Admin yang dapat mengakses informasi user lain.",
      };
    }

    return await userService.findByIdentifier(identifier);
  },
};

export default getUserInfoTool;
