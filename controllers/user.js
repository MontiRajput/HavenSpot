const User = require("../models/user");
//Signup Form
module.exports.renderSignupForm = (req, res) => {
  res.render("user/signUp.ejs");
};
//Post signup
module.exports.postSignup = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let newUser = new User({
      username,
      email,
    });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to HavenSpot!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//get login
module.exports.getLogin = (req, res) => {
  res.render("user/login.ejs");
};

//post login
module.exports.postLogin = async (req, res) => {
  req.flash("success", "Welcome back to HavenSpot!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//Get logout
module.exports.getLogout = async (req, res, next) => {
  await req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "LogOut successfully! ");
    res.redirect("/listings");
  });
};
