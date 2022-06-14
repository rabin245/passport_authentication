const mongoose = require("mongoose");
const Joi = require("joi");
const { joiPassword } = require("joi-password");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    // password: joiPassword().string().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
