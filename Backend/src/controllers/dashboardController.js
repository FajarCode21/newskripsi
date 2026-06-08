import dashboardService from "../services/dashboardService.js";

const dashboardController = {
  getDashboard: async (req, res, next) => {
    try {
      const dashboard = await dashboardService.getDashboard();

      res.status(200).json({
        status: "success",
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default dashboardController;
