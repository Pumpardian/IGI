const authToken = require("../middleware/authMiddleware.js");

module.exports = app => {
    const products = require("../controllers/productController.js");

    var router = require("express").Router();

    router.post("/", authToken, products.create);

    router.get("/", products.findAll);

    router.get("/:id", products.findOne);

    router.put("/:id", authToken, products.update);

    router.delete("/:id", authToken, products.delete);

    app.use('/api/products', router);
}