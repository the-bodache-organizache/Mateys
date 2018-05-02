module.exports = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    const err = new Error('Not allowed!');
    err.status = 403;
    next(err);
  }
};
