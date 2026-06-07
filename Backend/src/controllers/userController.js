import userValidator from "../validators/user/index.js";
import userService from "../services/userService.js";

const userController = {
  post: async (req, res, next) => {
    try {
      await userValidator.postPayload(req.body);
      const { employee_id, name, email, password, role } = req.body;

      const user = await userService.create(
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

  getByID: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
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

  deleteById: async (req, res, next) => {
    try {
      const { id } = req.params;
      await userService.deleteById(id);
      res.status(200).json({
        status: "success",
        message: "User berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const users = await userService.getAll(search);
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

  put: async (req, res, next) => {
    try {
      const { id_user, role: role_user } = req.user;
      const { id } = req.params;
      await userValidator.putPayload(req.body);
      const { name, password, role: updatedRole } = req.body;

      await userService.update(
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
