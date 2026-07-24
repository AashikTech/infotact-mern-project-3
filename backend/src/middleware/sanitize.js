// Input sanitization middleware
exports.sanitizeInput = (req, res, next) => {
  // Remove any MongoDB operators from request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'object' && req.body[key] !== null) {
        Object.keys(req.body[key]).forEach(innerKey => {
          if (innerKey.startsWith('$')) {
            delete req.body[key][innerKey];
          }
        });
      }
    });
  }
  next();
};
