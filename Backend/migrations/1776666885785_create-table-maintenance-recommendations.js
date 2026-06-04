export const up = (pgm) => {
  pgm.createTable('maintenance_recommendations', {
    id: 'id',
    rul_hours: { type: 'float' },
    rul_days: { type: 'float' },
    status: { type: 'varchar(255)' },
    priority: { type: 'varchar(255)' },
    action: { type: 'varchar(255)' },
    data_sensors_id: {
      type: 'int',
      notNull: true,
      references: 'data_sensors',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('maintenance_recommendations', ['data_sensors_id']);
};

export const down = (pgm) => {
  pgm.dropTable('maintenance_recommendations');
};
