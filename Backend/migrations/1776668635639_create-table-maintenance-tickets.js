export const up = (pgm) => {
  pgm.createType("status_maintencance_enum", [
    "Open",
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
    assigned_engineer_id: {
      type: "int",
      references: "users",
      onDelete: "set null",
    },
    status: {
      type: "status_maintencance_enum",
      notNull: true,
      default: "Open",
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
  pgm.createIndex("maintenance_tickets", ["assigned_engineer_id"]);
};

export const down = (pgm) => {
  pgm.dropTable("maintenance_tickets");
  pgm.dropType("status_maintencance_enum");
};
