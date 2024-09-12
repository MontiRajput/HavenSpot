const Listing = require("../models/listing");
const Review = require("../models/reviews");
//Post
module.exports.postReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user;
  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
};
//Delete
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  let review = await Review.findByIdAndDelete(reviewId);
  console.log(review);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
