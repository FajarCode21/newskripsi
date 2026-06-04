export const up = (pgm) => {
  pgm.createType('machine_status_enum', ['Active', 'Maintenance', 'Inactive']);

  pgm.createType('machine_type_enum', ['L', 'M', 'H']);

  pgm.createTable('machines', {
    id: 'id',
    code: { type: 'varchar(50)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    type: { type: 'machine_type_enum', notNull: true },
    location: { type: 'varchar(255)', notNull: true },
    install_date: { type: 'date' },
    status: {
      type: 'machine_status_enum',
      notNull: true,
      default: 'Active',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('machines');
  pgm.dropType('machine_status_enum');
  pgm.dropType('machine_type_enum');
};
