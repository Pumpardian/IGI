const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authMiddleware");

dotenv.config();

require("./config/auth.config.js")(passport);

const app = express();

var corsOptions = {
    origin: "http://localhost:8000",
    credentials: true
}

app.use(cors(corsOptions));
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.json({ message: "Hello World!" });
});

app.use(passport.initialize());
app.use(passport.session());

//Endpoints
require("./endpoints/userEndpoints.js")(app);
require("./endpoints/supplierEndpoints.js")(app);
require("./endpoints/aquisitionEndpoints.js")(app);
require("./endpoints/productEndpoints.js")(app);

app.get(
    "/auth/google/callback",
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
//TODO reg/login endpoints


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});