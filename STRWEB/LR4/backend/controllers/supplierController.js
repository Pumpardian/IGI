const db = require("../db.js");
const Supplier = db.suppliers;

exports.create = async (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content cannot be empty"
        });

        return;
    }

    const supplier = new Supplier({
        name: request.body.name,
        phone: request.body.phone,
        address: request.body.address
    });

    supplier.save()
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            if (err.code === 11000) {
                response.status(400).send({
                    message: "Supplier with provided phone already exists"
                });
            } else {
                response.status(500).send({
                    message: "Failed to create supplier (internal server error)"
                });
            }
        });
};

exports.findAll = (request, response) => {
    Supplier.find()
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: "Failed to get suppliers (internal server error)"
            });
        });
};

exports.findOne = (request, response) => {
    const id = request.params.id;

    Supplier.findById(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Supplier with id ${id} wasnt found`
                });
            }
            else
            {
                response.send(data);
            }
        })
        .catch(err => {
            response.status(500).send({
                message: `Failed to get supplier with id ${id} (internal server error)`
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

    Supplier.findByIdAndUpdate(id, request.body, { useFindAndModify: false })
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Supplier with id ${id} wasnt found, cant update then`
                });
            }
            else
            {
                response.send({
                    message: `Supplier with id ${id} was updated successfuly`
                });
            }
        })
        .catch(err => {
            if (err.code === 11000) {
                response.status(400).send({
                    message: "Supplier with provided phone already exists"
                });
            } else {
                response.status(500).send({
                    message: `Failed to update supplier with id ${id} (internal server error)`
                });
            }
        });
};

exports.delete = (request, response) => {
    const id = request.params.id;

    Supplier.findByIdAndRemove(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Supplier with id ${id} wasnt found, cant delete then`
                });
            }
            else
            {
                response.send({
                    message: `Supplier with id ${id} was deleted successfuly`
                });
            }
        })
        .catch(err => {
            response.status(500).send({
                message: `Failed to delete supplier with id ${id} (internal server error)`
            });
        });
};