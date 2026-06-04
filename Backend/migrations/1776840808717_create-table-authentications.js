export const up = (pgm) => {
  pgm.createTable('authentications', {
    owner: {
      type: 'int',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    token: { type: 'varchar(255)', notNull: true },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('authentications');
};
