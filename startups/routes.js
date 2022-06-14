const users = require("../routes/users");

module.exports = function (app) {
  app.use("/", users);

  // 404 not found
  app.use((req, res) => {
    res.status(404).render("404");
  });
};
