module.exports = app => {
    const products = require("../controllers/productController.js");

    var router = require("express").Router();

    router.post("/", products.create);

    router.get("/", products.findAll);

    router.get("/:id", products.findOne);

    router.put("/:id", products.update);

    router.delete("/:id", products.delete);

    app.use('/api/products', router);
}