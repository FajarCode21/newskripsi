import machineService from "../services/machineService.js";
import machineValidator from "../validators/machine/index.js";

const machineController = {
  getAll: async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const machines = await machineService.getAll(search);
      res.status(200).json({
        status: "success",
        data: {
          machines,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const machine = await machineService.getById(id);
      res.status(200).json({
        status: "success",
        data: {
          machine,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      machineValidator.postPayload(req.body);
      const { name, code, type, location, install_date } = req.body;
      const machine = await machineService.create(
        name,
        code,
        type,
        location,
        install_date,
      );
      res.status(201).json({
        status: "success",
        data: {
          machine,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      machineValidator.putPayload(req.body);
      const { name, code, type, location, install_date } = req.body;
      const machine = await machineService.update(
        id,
        name,
        code,
        type,
        location,
        install_date,
      );
      res.status(200).json({
        status: "success",
        data: {
          machine,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req, res, next) => {
    try {
      const { id } = req.params;
      await machineService.deleteById(id);
      res.status(200).json({
        status: "success",
        message: "Machine deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default machineController;
