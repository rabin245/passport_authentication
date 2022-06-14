const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const { isLoggedIn, isLoggedOut } = require("../config/auth");
const passport = require("passport");

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("signup", { title: "Signup" });
});

router.post("/signup", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  let errors = [];

  // check requried fields
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ msg: "Please fill in all fields" });
  }
  // check if passwords match
  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }
  // check if password is at least 6 characters
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  // joi validation
  const { error } = validate({ name, email, password });
  if (error) {
    errors.push({ msg: error.details[0].message });
    res.render("signup", {
      title: "Signup",
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }

  if (errors.length > 0) {
    res.render("signup", {
      title: "Signup",
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  } else {
    // validation passed
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          errors.push({ msg: "Email already registered" });
          res.render("signup", {
            title: "Signup",
            errors,
            name,
            email,
            password,
            confirmPassword,
          });
        } else {
          const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            password,
          });
          // hash password before saving
          bcrypt.genSalt(10).then((salt) => {
            bcrypt
              .hash(newUser.password, salt)
              .then((hash) => {
                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => {
                    req.flash(
                      "success_msg",
                      "You are now registered and can log in"
                    );
                    res.redirect("/login");
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => {
                throw err;
              });
          });
        }
      })
      .catch((err) => console.log(err));
  }
});

router.post("/login", (req, res) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      // next(err);
    }

    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
});

router.get("/", isLoggedIn, (req, res) => {
  res.render("index", { title: "Home", name: req.user.name });
});

module.exports = router;
