export const up = (pgm) => {
  pgm.createTable('report_images', {
    id: 'id',
    report_id: {
      type: 'int',
      notNull: true,
      references: 'maintenance_reports',
      onDelete: 'cascade',
    },
    image_url: { type: 'varchar(255)', notNull: true },
  });

  pgm.createIndex('report_images', ['report_id']);
};

export const down = (pgm) => {
  pgm.dropTable('report_images');
};
