import ticketMaintenanceService from "../services/ticketMaintenanceService.js";
import InvariantError from "../exceptions/InvariantError.js";
import ticketMaintenanceValidator from "../validators/ticketMaintenance/index.js";

const ticketMaintenanceController = {
  getAll: async (req, res, next) => {
    try {
      const { id_user, role } = req.user;

      const tickets = await ticketMaintenanceService.getAll(id_user, role);

      res.status(200).json({
        status: "success",
        data: {
          tickets,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: user_id, role } = req.user;

      const ticket = await ticketMaintenanceService.getById(id, user_id, role);

      res.status(200).json({
        status: "success",
        data: {
          ticket,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  assign: async (req, res, next) => {
    try {
      const { id } = req.params;
      ticketMaintenanceValidator.assignPayload(req.body);
      const { assigned_engineer_id } = req.body;

      const ticket = await ticketMaintenanceService.assign(
        id,
        assigned_engineer_id,
      );

      res.status(200).json({
        status: "success",
        data: {
          ticket,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  start: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id_user } = req.user;

      const ticket = await ticketMaintenanceService.start(id, id_user);

      res.status(200).json({
        status: "success",
        data: {
          ticket,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  submit: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id_user } = req.user;

      ticketMaintenanceValidator.submitPayload(req.body);

      if (!req.file) {
        throw new InvariantError("Gambar wajib diunggah");
      }
      const ticket = await ticketMaintenanceService.submit(
        id,
        id_user,
        req.body,
        req.file,
      );

      res.status(200).json({
        status: "success",
        data: {
          ticket,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  approve: async (req, res, next) => {
    try {
      const { id } = req.params;

      const ticket = await ticketMaintenanceService.approve(id);

      res.status(200).json({
        status: "success",
        data: {
          ticket,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ticketMaintenanceController;
