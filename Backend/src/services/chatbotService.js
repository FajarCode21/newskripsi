import chatHistoryService from "../chatbot-service/services/chatHistoryService.js";
import agentService from "../chatbot-service/services/agentService.js";

const chatbotService = {
  chat: async ({ user, sessionId, message }) => {
    const userId = user.id_user;

    let session = sessionId
      ? await chatHistoryService.getSessionById(sessionId, userId)
      : await chatHistoryService.createSession(
          userId,
          message.substring(0, 100),
        );

    const history = await chatHistoryService.getMessages(
      session.id,
      userId,
      10,
    );

    const { answer, contextPatch } = await agentService.process({
      user,
      message,
      history,
      sessionContext: session.context || {},
    });

    await chatHistoryService.addMessage(session.id, "user", message);
    await chatHistoryService.addMessage(session.id, "assistant", answer);

    if (contextPatch && Object.keys(contextPatch).length > 0) {
      await chatHistoryService.updateSessionContext(
        session.id,
        userId,
        contextPatch,
      );
    }

    return { sessionId: session.id, answer };
  },
};

export default chatbotService;
