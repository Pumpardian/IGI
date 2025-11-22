const dbConfig = require("./config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require("./models/User.js")(db.mongoose);
db.products = require("./models/Product.js")(db.mongoose);
db.suppliers = require("./models/Supplier.js")(db.mongoose);
db.aquisitions = require("./models/Aquisition.js")(db.mongoose);

db.mongoose.connect(db.url, {
}).then(() => {
    console.log("Connection to the database has been established");
}).catch(err => {
    console.log("Connection to the database has failed", err);
    process.exit();
});

module.exports = db;