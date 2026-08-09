export const up = async (pgm) => {
  pgm.createTable("chat_messages", {
    id: "id",
    session_id: {
      type: "int",
      notNull: true,
      references: "chat_sessions",
      onDelete: "cascade",
    },
    role: {
      type: "varchar(50)",
      notNull: true,
    },
    content: {
      type: "text",
      notNull: true,
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("chat_messages", ["session_id"]);
  pgm.createIndex("chat_messages", ["created_at"]);
};

export const down = async (pgm) => {
  pgm.dropTable("chat_messages");
};
