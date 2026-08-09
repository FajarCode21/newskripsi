export const up = async (pgm) => {
  pgm.addColumn("chat_sessions", {
    context: {
      type: "jsonb",
      default: pgm.func("'{}'::jsonb"),
    },
  });
};

export const down = async (pgm) => {
  pgm.dropColumn("chat_sessions", "context");
};
