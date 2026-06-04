export const up = (pgm) => {
  pgm.createTable("maintenance_reports", {
    id: "id",
    maintenance_ticket_id: {
      type: "int",
      notNull: true,
      references: "maintenance_tickets",
      onDelete: "cascade",
    },
    description: { type: "text" },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("maintenance_reports", ["maintenance_ticket_id"]);
};

export const down = (pgm) => {
  pgm.dropTable("maintenance_reports");
};
