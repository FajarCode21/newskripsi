export const up = async (pgm) => {
  pgm.createTable("chat_sessions", {
    id: "id",
    user_id: {
      type: "int",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("chat_sessions", ["user_id"]);
};

export const down = async (pgm) => {
  pgm.dropTable("chat_sessions");
};
