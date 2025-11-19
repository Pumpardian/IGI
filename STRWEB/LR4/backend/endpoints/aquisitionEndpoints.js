module.exports = app => {
    const aquisitions = require("../controllers/aquisitionController.js");

    var router = require("express").Router();

    router.post("/", aquisitions.create);

    router.get("/", aquisitions.findAll);

    router.get("/:id", aquisitions.findOne);

    router.put("/:id", aquisitions.update);

    router.delete("/:id", aquisitions.delete);

    app.use('/api/aquisitions', router);
}