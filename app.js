if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); //to convert post to delete and put request
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRoute = require("./routes/listings.js"); //routes
const reviewRoute = require("./routes/review.js"); //routes
const userRoute = require("./routes/user.js"); //routes
const MongoStore = require("connect-mongo"); //for store sessions on internet
const session = require("express-session"); //user session id for diffrent browsers
const flash = require("connect-flash"); //for alerts
const passport = require("passport"); //for login and signup
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const mongodb_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbURL);
}
main()
  .then((res) => {
    console.log("Connected to wanderlust");
  })
  .catch((e) => {
    console.log(e);
  });

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //24 hours
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO STORE SESSION", err);
});
let sessionOption = {
  store, //store:store
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, //days * hours in a day * minutes in a hour * seconds in a minutes * milliseconds in a second
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionOption));
app.use(flash());
//passport intialize must after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //to save  user session data
passport.deserializeUser(User.deserializeUser()); //to delete user session data

//flashes
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

//Error handler
app.all("*", (req, res, next) => {
  next(new ExpressError(400, "Page not found!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err; //default err
  // res.status(statusCode).send(message);
  res.status(statusCode).render("err.ejs", { message });
});

app.listen(3000, () => {
  console.log("I am listning on port 3000");
});
