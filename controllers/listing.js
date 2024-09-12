const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBox_token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBox_token });
//index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//new
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//filter
module.exports.filterPost = async (req, res) => {
  let filter = req.body.filter;
  let allListings = await Listing.find({ category: `${filter}` });
  res.render("listings/filter.ejs", { allListings });
};

//show
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing is not exists!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

//create
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = req.body.listing;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  let savedlisting = await new Listing(newListing).save();
  console.log(savedlisting);
  req.flash("success", "Added new listing successfully!");
  res.redirect("listings");
};

//edit
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing is not exists!");
    return res.redirect("/listings");
  }
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace(
    "/upload",
    "/upload/h_70,w_100,e_blur:10"
  );

  res.render("listings/edit.ejs", { listing, originalimageurl });
};

//update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

//delete
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing delete successfully!");
  res.redirect("/listings");
};
