const authToken = require("../middleware/authMiddleware.js");

module.exports = app => {
    const suppliers = require("../controllers/supplierController.js");

    var router = require("express").Router();

    router.post("/", authToken, suppliers.create);

    router.get("/", suppliers.findAll);

    router.get("/:id", suppliers.findOne);

    router.put("/:id", authToken, suppliers.update);

    router.delete("/:id", authToken, suppliers.delete);

    app.use('/api/suppliers', router);
}