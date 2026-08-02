export const up = (pgm) => {
  pgm.createType("status_maintenance_enum", [
    "WaitingAssignment",
    "Assigned",
    "InProgress",
    "WaitingApproval",
    "Done",
    "Rejected",
  ]);

  pgm.createTable("maintenance_tickets", {
    id: "id",
    machine_id: {
      type: "int",
      notNull: true,
      references: "machines",
      onDelete: "cascade",
    },
    failure_statistic_id: {
      type: "int",
      notNull: true,
      references: "failure_statistics",
      onDelete: "cascade",
    },
    status: {
      type: "status_maintenance_enum",
      notNull: true,
      default: "WaitingAssignment",
    },
    notes: {
      type: "text",
      default: null,
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

  pgm.createIndex("maintenance_tickets", ["machine_id"]);
};

export const down = (pgm) => {
  pgm.dropTable("maintenance_tickets");
  pgm.dropType("status_maintenance_enum");
};
