const db = require("../db.js");
const bcrypt = require("bcrypt");
const User = db.users;

exports.create = async (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    let user;

    if (request.body.googleID)
    {
        user = new User({
            name: request.body.name,
            googleID: request.body.googleID ?? null
        });
    }
    else
    {
        user = new User({
            name: request.body.name,
            password: await bcrypt.hash(request.body.password, 10)
        });
    }

    User.save(user)
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? "Failed to create user"
            });
        });
};

exports.findOne = (request, response) => {
    const id = request.params.id;

    User.findById(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `User with id ${id} wasnt found`
                });
            }
            else
            {
                response.send(data);
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to get user with id ${id}`
            });
        });
};

exports.update = (request, response) => {
    if (!request.body) {
        response.status(400).send({ message: "Content cannot be empty" });
        return;
    }

    const id = request.params.id;

    User.findByIdAndUpdate(id, request.body, { useFindAndModify: false })
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `User with id ${id} wasnt found, cant update then`
                });
            }
            else
            {
                response.send({
                    message: `User with id ${id} was updated successfuly`
                });
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to update user with id ${id}`
            });
        });
};

exports.delete = (request, response) => {
    const id = request.params.id;

    User.findByIdAndRemove(id)
        .then(data => {
            if (!data)
            {
                response.status(404).send({
                    message: `User with id ${id} wasnt found, cant delete then`
                });
            }
            else
            {
                response.send({
                    message: `User with id ${id} was deleted successfuly`
                });
            }
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to delete user with id ${id}`
            });
        });
};