const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose); // Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
//Additionally, Passport-Local Mongoose adds some methods to your Schema.

const User = mongoose.model("User", userSchema);

module.exports = User;
