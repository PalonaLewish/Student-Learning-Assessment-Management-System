exports.ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login?error=Please login to continue');
};

exports.ensureAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/dashboard?error=Admin access required');
};

exports.ensureStudent = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'student') {
    return next();
  }
  res.redirect('/dashboard?error=Student access required');
};
