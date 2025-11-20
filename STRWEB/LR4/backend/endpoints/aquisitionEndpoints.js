const authToken = require("../middleware/authMiddleware.js");

module.exports = app => {
    const aquisitions = require("../controllers/aquisitionController.js");

    var router = require("express").Router();

    router.post("/", authToken, aquisitions.create);

    router.get("/", aquisitions.findAll);

    router.get("/:id", aquisitions.findOne);

    router.put("/:id", authToken, aquisitions.update);

    router.delete("/:id", authToken, aquisitions.delete);

    app.use('/api/aquisitions', router);
}