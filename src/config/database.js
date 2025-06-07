const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect("mongodb+srv://learntechpassion:8Iz1nYhGjLxhjWVE@namastenode.osrsc6u.mongodb.net/devTinder")
};

module.exports = connectDb;