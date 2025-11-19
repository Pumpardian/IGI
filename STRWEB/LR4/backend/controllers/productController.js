const db = require("../db.js");
const Product = db.products;

exports.create = async (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    const product = new Product({
        title: request.body.title,
        description: request.body.description,
        price: request.body.price,
        partNumber: request.body.partNumber
    });

    Product.save(product)
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? "Failed to create product"
            });
        });
};

exports.findAll = (request, response) => {
    const search = request.query.search;
    const condition = title ? { $or: [
        { title: { $regex: new RegExp(search), $options: "i" } },
        { partNumber: { $regex: new RegExp(search), $options: "i" } }
    ]} : {};

    Product.find(condition)
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to get products`
            });
        });
};

exports.findOne = (request, response) => {
    const id = request.params.id;

    Product.findById(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Product with id ${id} wasnt found`
                });
            }
            else
            {
                response.send(data);
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to get product with id ${id}`
            });
        });
};

exports.update = (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    const id = request.params.id;

    Product.findByIdAndUpdate(id, request.body, { useFindAndModify: false })
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Product with id ${id} wasnt found, cant update then`
                });
            }
            else
            {
                response.send({
                    message: `Product with id ${id} was updated successfuly`
                });
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to update product with id ${id}`
            });
        });
};

exports.delete = (request, response) => {
    const id = request.params.id;

    Product.findByIdAndRemove(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Product with id ${id} wasnt found, cant delete then`
                });
            }
            else
            {
                response.send({
                    message: `Product with id ${id} was deleted successfuly`
                });
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to delete product with id ${id}`
            });
        });
};