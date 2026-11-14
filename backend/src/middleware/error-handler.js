function notFoundHandler(req, res) {
  res.status(404).json({ error: `Path ${req.originalUrl} not found.` });
}

function errorHandler(err, req, res, next) {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error.',
  });
}

module.exports = { notFoundHandler, errorHandler };
