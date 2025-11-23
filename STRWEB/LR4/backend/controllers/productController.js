const db = require("../db.js");
const Product = db.products;
const path = require("path");
const fs = require("fs");
const uploadSingleImage = require('../config/multer.config.js');

const deleteFile = (filePath) => {
    try {
        const file = path.join(__dirname, '..', filePath);

        fs.unlinkSync(file);
        console.log(`Successfully deleted file: ${file}`);
        return true;
        
    } catch (error) {
        console.error(`Error deleting file:`, error.message);
        return false;
    }
};

exports.create = async (request, response) => {
    uploadSingleImage(request, response, async (e) => {
        try {
            if (e) {
                return response.status(400).json({
                    message: err.message
                });
            }

            if (!request.body) {
                response.status(400).send({
                    message: "Content cannot be empty"
                });

                return;
            }

            const { title, description, price, partNumber } = request.body;

            if (!request.file) {
                return response.status(400).send({
                    message: "Image required"
                });
            }

            if (!title || !description || !price || !partNumber) {
                return response.status(400).send({
                    message: "All fields are required"
                });
            }

            const product = new Product({
                title: title,
                description: description,
                price: price,
                partNumber: partNumber,
                image: {
                    url: `/media/${request.file.filename}`,
                    filename: request.file.filename,
                    originalName: request.file.originalname
                }
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
        } catch (error) {
            response.status(400).send({
                message: error.message
            });
        }
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
    uploadSingleImage(request, response, async (e) => {
        try {
            if (e) {
                return response.status(400).json({
                    message: err.message
                });
            }

            if (!request.body) {
                response.status(400).send({
                    message: "Content cannot be empty"
                });

                return;
            }

            const id = request.params.id;
            const { title, description, price, partNumber } = request.body;
            const updatedData = { title, description, price, partNumber };

            if (request.file) {
                const currentProduct = await Product.findById(id);

                if (currentProduct) {
                    deleteFile(currentProduct.image.url);
                }

                updatedData.image = {
                    url: `/media/${request.file.filename}`,
                    filename: request.file.filename,
                    originalName: request.file.originalname
                };
            }

            Product.findByIdAndUpdate(id, updatedData, { useFindAndModify: false, new: true, runValidators: true })
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

                    console.error(err.message);
                });
        } catch (error) {
            response.status(400).send({
                message: error.message
            });
        }
    });
};

exports.delete = async (request, response) => {
    const id = request.params.id;

    const product = await Product.findById(id);

    if (product) {
        deleteFile(product.image.url);
    }

    Product.findByIdAndDelete(id)
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