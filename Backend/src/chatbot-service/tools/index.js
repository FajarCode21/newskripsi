import getMachineInfoTool from "./machines/machinesInfoTools.js";
import listMachinesTool from "./machines/listMachinesTool.js";
import getLatestSensorTool from "./sensors/latestSensorTool.js";
import getSensorHistoryTool from "./sensors/sensorHistoryTool.js";
import getMaintenanceRecommendationTool from "./maintenance/recommendationTool.js";
import getFailureStatisticsTool from "./maintenance/failureStatisticTool.js";
import getMaintenanceTicketsTool from "./tickets/ticketListTool.js";
import getTicketDetailTool from "./tickets/ticketDetailTool.js";
import getMaintenanceReportTool from "./reports/reportTool.js";
import getUserInfoTool from "./users/userInfoTool.js";

const tools = [
  getMachineInfoTool,
  listMachinesTool,
  getLatestSensorTool,
  getSensorHistoryTool,
  getMaintenanceRecommendationTool,
  getFailureStatisticsTool,
  getMaintenanceTicketsTool,
  getTicketDetailTool,
  getMaintenanceReportTool,
  getUserInfoTool,
];

export default tools;
