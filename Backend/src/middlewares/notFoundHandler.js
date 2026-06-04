const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Method ${req.method} route ${req.originalUrl} tidak ditemukan`,
  });
};

export default notFoundHandler;
