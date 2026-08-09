import chatbotService from "../services/chatbotService.js";

const chatbotController = {
  chat: async (req, res, next) => {
    try {
      const { message, sessionId } = req.body;

      const user = req.user;
      console.log("user", user);

      const result = await chatbotService.chat({
        user,
        sessionId,
        message,
      });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default chatbotController;
