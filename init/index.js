const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
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
const initDB = async () => {
  await Listing.deleteMany({}); //this will clean the database delete all data existing

  await Listing.insertMany(initData.data);
  console.log("data was initialized.");
};

initDB();
