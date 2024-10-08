const Listing = require("../models/listing");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../Schema.js"); //it require server side validation of listings and reviews
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "First you need to login!");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not Owner of this listing");
    return res.redirect(`/listings/${listing.id}`);
  }
  next();
};
//validation function check hoppscotch operations error for listings
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
//validation function check hoppscotch operations error for reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
