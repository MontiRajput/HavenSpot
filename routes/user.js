const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/user.js");
const { saveUrl } = require("../views/middleware.js");
//signup page
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.postSignup));

//login page
router
  .route("/login")
  .get(userController.getLogin)
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postLogin
  );

router.get("/logout", userController.getLogout);

// Redirect to Google
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    res.redirect("/"); // or wherever you want
  }
);
module.exports = router;
