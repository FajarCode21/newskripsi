import ticketMaintenanceService from "../services/ticketMaintenanceService.js";
import InvariantError from "../exceptions/InvariantError.js";
import ticketMaintenanceValidator from "../validators/ticketMaintenance/index.js";

const ticketMaintenanceController = {
  getAllTickets: async (req, res, next) => {
    try {
      const { id_user, role } = req.user;

      const tickets = await ticketMaintenanceService.getAllTickets(
        id_user,
        role,
      );

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

  getTicketById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id_user, role } = req.user;

      const ticket = await ticketMaintenanceService.getTicketById(
        id,
        id_user,
        role,
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

  // Fitur 1 & 2: assign leader + (opsional) member, sekaligus catatan admin
  patchAssignTicket: async (req, res, next) => {
    try {
      const { id } = req.params;
      ticketMaintenanceValidator.patchAssignTicketPayload(req.body);
      const { leader_id, member_ids, notes } = req.body;

      const ticket = await ticketMaintenanceService.assignTicket(id, {
        leader_id,
        member_ids,
        notes,
      });

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

  patchStartTicket: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id_user } = req.user;

      const ticket = await ticketMaintenanceService.startTicket(id, id_user);

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

  patchSubmitTicket: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id_user } = req.user;

      ticketMaintenanceValidator.patchSubmitTicketPayload(req.body);

      if (!req.file) {
        throw new InvariantError("Gambar wajib diunggah");
      }
      const ticket = await ticketMaintenanceService.submitTicket(
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

  patchApproveTicket: async (req, res, next) => {
    try {
      const { id } = req.params;

      const ticket = await ticketMaintenanceService.approveTicket(id);

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

  // Fitur 4: admin menolak laporan
  patchRejectTicket: async (req, res, next) => {
    try {
      const { id } = req.params;
      ticketMaintenanceValidator.patchRejectTicketPayload(req.body);
      const { notes } = req.body;

      const ticket = await ticketMaintenanceService.rejectTicket(id, notes);

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

  // Fitur 5: admin menghapus tiket yang belum ditugaskan
  deleteTicket: async (req, res, next) => {
    try {
      const { id } = req.params;

      await ticketMaintenanceService.deleteTicket(id);

      res.status(200).json({
        status: "success",
        message: "Tiket berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ticketMaintenanceController;
