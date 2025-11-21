const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authMiddleware");
const { session } = require("passport");

dotenv.config();

require("./config/auth.config.js")(passport);

const app = express();

var corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}

app.use(cors(corsOptions));
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.json({ message: "Hello World!" });
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || "backup_session_secret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })
);

app.use(passport.initialize());
app.use(passport.session());

//Endpoints
require("./endpoints/userEndpoints.js")(app);
require("./endpoints/supplierEndpoints.js")(app);
require("./endpoints/aquisitionEndpoints.js")(app);
require("./endpoints/productEndpoints.js")(app);

app.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id, username: req.user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        res.redirect(`http://localhost:3000?token=${token}`);
    },
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});