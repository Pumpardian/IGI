const passport = require("passport");
const authToken = require("../middleware/authMiddleware.js");

module.exports = app => {
    const users = require("../controllers/userController.js");

    var router = require("express").Router();

    router.post("/signup", users.create);

    router.post("/signin", users.login);

    router.get("/:id", authToken, users.findOne);

    //router.put("/:id",  users.update);

    router.delete("/:id", authToken, users.delete);

    app.use('/api/users', router);
}