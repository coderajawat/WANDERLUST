if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");   

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  try {
    let defaultUser = await User.findOne({ username: "admin123" });

    if (!defaultUser) {
      defaultUser = new User({
        username: "admin123",
        email: "admin123@gmail.com",
      });
      await User.register(defaultUser, process.env.DEFAULTUSER_PASSWORD);
      console.log("Default user created");
    } else {
      console.log("Default user already exists");
    }

    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: defaultUser._id,
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};

initDB();
