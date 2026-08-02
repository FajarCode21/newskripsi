export const up = (pgm) => {
  pgm.createType("maintenance_assignment_role_enum", ["Leader", "Member"]);

  pgm.createTable("maintenance_ticket_assignments", {
    id: "id",

    maintenance_ticket_id: {
      type: "int",
      notNull: true,
      references: "maintenance_tickets",
      onDelete: "cascade",
    },

    user_id: {
      type: "int",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },

    role: {
      type: "maintenance_assignment_role_enum",
      notNull: true,
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("maintenance_ticket_assignments", ["maintenance_ticket_id"]);

  pgm.createIndex("maintenance_ticket_assignments", ["user_id"]);

  pgm.addConstraint("maintenance_ticket_assignments", "unique_ticket_user", {
    unique: ["maintenance_ticket_id", "user_id"],
  });
};

export const down = (pgm) => {
  pgm.dropTable("maintenance_ticket_assignments");
  pgm.dropType("maintenance_assignment_role_enum");
};
