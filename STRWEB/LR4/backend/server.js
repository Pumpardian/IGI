const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

var corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "backup_session_secret",
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: false,
            maxAge: 60000
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

require("./config/auth.config.js")(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.json({ message: "Hello World!" });
});

//Endpoints
require("./endpoints/userEndpoints.js")(app);
require("./endpoints/supplierEndpoints.js")(app);
require("./endpoints/aquisitionEndpoints.js")(app);
require("./endpoints/productEndpoints.js")(app);

app.get("/logout", (request, response) => {
  request.logout((err) => {
    if (err) {
        return response.status(500).json({
            error: "Error while logging out"
        });
    }
    response.json({
        message: "Logged out"
    });
  });
});

app.get("/google", passport.authenticate("google", { scope: [ "profile", "email" ] }));

app.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (request, response) => {
        const token = jwt.sign(
            { id: request.user.id, username: request.user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        response.redirect(`http://localhost:3000?token=${token}`);
    },
);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
});