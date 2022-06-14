module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash("error_msg", "Please login to continue");
    res.redirect("/login");
  },
  isLoggedOut: function (req, res, next) {
    if (!req.isAuthenticated()) return next();
    req.flash("error_msg", "You are already logged in. Log out to continue.");
    res.redirect("/");
  },
};
