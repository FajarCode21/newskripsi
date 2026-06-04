export const up = (pgm) => {
  pgm.createTable('data_sensors', {
    id: 'id',

    date_time: {
      type: 'timestamp',
      notNull: true,
    },

    rotational_speed: { type: 'float' },
    process_temperature: { type: 'float' },
    air_temperature: { type: 'float' },
    torque: { type: 'float' },
    tool_wear: { type: 'float' },

    machine_age_hours: { type: 'float' },
    hours_since_last: { type: 'float' },
    temp_rate_of_change: { type: 'float' },
    rpm_variance: { type: 'float' },

    machine_id: {
      type: 'int',
      notNull: true,
      references: 'machines',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('data_sensors', ['machine_id']);
  pgm.createIndex('data_sensors', ['date_time']);
};

export const down = (pgm) => {
  pgm.dropTable('data_sensors');
};
