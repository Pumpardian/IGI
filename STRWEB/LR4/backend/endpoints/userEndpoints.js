module.exports = app => {
    const users = require("../controllers/userController.js");

    var router = require("express").Router();

    router.post("/", users.create);

    router.get("/:id", users.findOne);

    router.put("/:id", users.update);

    router.delete("/:id", users.delete);

    app.use('/api/users', router);
}

//TODO split to user and auth endpoints