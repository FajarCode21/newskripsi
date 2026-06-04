export const up = (pgm) => {
  pgm.createTable('failure_statistics', {
    id: 'id',
    type: { type: 'varchar(255)' },
    confidence: { type: 'float' },
    heat_dissipation_failure: { type: 'float' },
    random_failures: { type: 'float' },
    overstrain_failure: { type: 'float' },
    power_failure: { type: 'float' },
    tool_wear_failure: { type: 'float' },
    maintenance_recommendation_id: {
      type: 'int',
      notNull: true,
      references: 'maintenance_recommendations',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('failure_statistics', ['maintenance_recommendation_id']);
};

export const down = (pgm) => {
  pgm.dropTable('failure_statistics');
};
