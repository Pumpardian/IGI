const db = require("../db.js");
const Aquisition = db.aquisitions;

exports.create = async (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    const aquisition = new Aquisition({
        productID: request.body.productID,
        supplierID: request.body.supplierID,
        price: request.body.price,
        count: request.body.count,
        date: request.body.date
    });

    Aquisition.save(aquisition)
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? "Failed to create aquisition"
            });
        });
};

exports.findAll = (request, response) => {
    //const search = request.query.search;
    const condition = /*title ? { $or: [
        { name: { $regex: new RegExp(search), $options: "i" } },
        { phone: { $regex: new RegExp(search), $options: "i" } },
        { address: { $regex: new RegExp(search), $options: "i" } }
    ]} :*/ {};

    Aquisition.find(condition)
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to get aquisitions`
            });
        });
};

exports.findOne = (request, response) => {
    const id = request.params.id;

    Aquisition.findById(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Aquisition with id ${id} wasnt found`
                });
            }
            else
            {
                response.send(data);
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to get aquisition with id ${id}`
            });
        });
};

exports.update = (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    const id = request.params.id;

    Aquisition.findByIdAndUpdate(id, request.body, { useFindAndModify: false })
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Aquisition with id ${id} wasnt found, cant update then`
                });
            }
            else
            {
                response.send({
                    message: `Aquisition with id ${id} was updated successfuly`
                });
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to update aquisition with id ${id}`
            });
        });
};

exports.delete = (request, response) => {
    const id = request.params.id;

    Aquisition.findByIdAndRemove(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `Aquisition with id ${id} wasnt found, cant delete then`
                });
            }
            else
            {
                response.send({
                    message: `Aquisition with id ${id} was deleted successfuly`
                });
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to delete aquisition with id ${id}`
            });
        });
};