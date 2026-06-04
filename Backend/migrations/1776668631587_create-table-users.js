export const up = (pgm) => {
  pgm.createType("user_role_enum", ["Admin", "Engineer"]);
  pgm.createType("status_user_enum", ["Active", "Onduty", "Inactive"]);

  pgm.createTable("users", {
    id: "id",
    employee_id: { type: "varchar(50)", notNull: true, unique: true },
    name: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    password: { type: "varchar(255)", notNull: true },
    status: { type: "status_user_enum", notNull: true, default: "Active" },
    role: { type: "user_role_enum", notNull: true },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("users", ["email"]);
};

export const down = (pgm) => {
  pgm.dropTable("users");
  pgm.dropType("user_role_enum");
  pgm.dropType("status_user_enum");
};
