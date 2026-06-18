import userValidator from "../validators/user/index.js";
import userService from "../services/userService.js";

const userController = {
  postUser: async (req, res, next) => {
    try {
      await userValidator.postUserPayload(req.body);
      const { employee_id, name, email, password, role } = req.body;

      const user = await userService.createUser(
        employee_id,
        name,
        email,
        password,
        role,
      );
      res.status(201).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      await userService.deleteUserById(id);
      res.status(200).json({
        status: "success",
        message: "User berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const users = await userService.getAllUsers(search);
      res.status(200).json({
        status: "success",
        data: {
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  putUser: async (req, res, next) => {
    try {
      const { id_user, role: role_user } = req.user;
      const { id } = req.params;
      await userValidator.putUserPayload(req.body);
      const { name, password, role: updatedRole } = req.body;

      await userService.updateUser(
        id_user,
        id,
        name,
        password,
        role_user,
        updatedRole,
      );
      res.status(200).json({
        status: "success",
        message: "User berhasil diperbarui",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
