const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "backup_jwt_secret";

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
            username: request.body.username,
            googleID: request.body.googleID ?? null
        });
    }
    else
    {
        user = new User({
            username: request.body.username,
            password: await bcrypt.hash(request.body.password, 10)
        });
    }

    user.save()
        .then(data => {
            response.send(data);
        })
        .catch(err => {
            response.status(500).send({
                message: err.message ?? "Failed to create user"
            });
        });
};

exports.login = (request, response) => {
    const { username, password } = request.body;

    User.findOne({ username: username })
        .then(async data => {
            if (!data || !(await bcrypt.compare(password, data.password)))
            {
                response.status(401).send({
                    message: `Invalid user credentials`
                });
            }
            else
            {
                const token = jwt.sign({ id: data.id, username: data.username }, JWT_SECRET, { expiresIn: "1h" });
                response.json({ token, username: username });
            }
        }).catch(err => {
            response.status(500).send({
                message: err.message ?? `Failed to log in`
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

/*exports.update = (request, response) => {
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
};*/

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