const db = require("../db.js");
const Supplier = db.suppliers;

exports.create = async (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    const supplier = new Supplier({
        name: request.body.title,
        phone: request.body.phone,
        address: request.body.address
    });

    Supplier.save(supplier)
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? "Failed to create supplier"
            });
        });
};

exports.findAll = (request, response) => {
    const search = request.query.search;
    const condition = title ? { $or: [
        { name: { $regex: new RegExp(search), $options: "i" } },
        { phone: { $regex: new RegExp(search), $options: "i" } },
        { address: { $regex: new RegExp(search), $options: "i" } }
    ]} : {};

    Supplier.find(condition)
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to get suppliers`
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
                message: err.message ?? `Failed to get supplier with id ${id}`
            });
        });
};

exports.update = (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
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
            response.status(500).send({
                message: err.message ?? `Failed to update supplier with id ${id}`
            });
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
                message: err.message ?? `Failed to delete supplier with id ${id}`
            });
        });
};