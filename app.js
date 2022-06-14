const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

// connect to db
require("./startups/db")();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use(express.static(__dirname + "/public"));

// EJS
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");

// Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// passport config
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

// connect flash
app.use(flash());
// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// routes
require("./startups/routes")(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
