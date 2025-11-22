const db = require("../db.js");
const Product = db.products;

exports.create = async (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content cannot be empty"
        });

        return;
    }

    const product = new Product({
        title: request.body.title,
        description: request.body.description,
        price: request.body.price,
        partNumber: request.body.partNumber
    });

    product.save()
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: "Failed to create product (internal server error)"
            });
        });
};

exports.findAll = (request, response) => {
    Product.find()
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: "Failed to get products (internal server error)"
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
                message: `Failed to get product with id ${id} (internal server error)`
            });
        });
};

exports.update = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content cannot be empty"
        });

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
                message: `Failed to update product with id ${id} (internal server error)`
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
                message: `Failed to delete product with id ${id} (internal server error)`
            });
        });
};