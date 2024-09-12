const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then((res) => {
    console.log("Connected to wanderlust");
  })
  .catch((e) => {
    console.log(e);
  });
const initDB = async () => {
  await Listing.deleteMany({}); //this will clean the database delete all data existing
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66dbb5567c864fa786b061a4",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized.");
};

initDB();
