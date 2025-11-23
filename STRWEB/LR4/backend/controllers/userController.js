const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "backup_jwt_secret";

const User = db.users;

exports.create = async (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Content cannot be empty"
        });

        return;
    }

    let user;

    if (request.body.googleID)
    {
        user = new User({
            username: request.body.username,
            email: request.body.email,
            googleID: request.body.googleID ?? null
        });
    }
    else
    {
        user = new User({
            username: request.body.username,
            email: request.body.email,
            password: await bcrypt.hash(request.body.password, 10)
        });
    }

    user.save()
        .then(data => {
            response.send(data);
            return data.username;
        })
        .then(username => {
            console.log("user registered:", username);
        })
        .catch(err => {
            if (err.code === 11000) {
                response.status(400).send({
                    message: "User with provided username/email already exists"
                });
            } else {
                response.status(500).send({
                    message: "Failed to sign up (internal server error)"
                });
            }
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
                const token = jwt.sign({ id: data.id, username: data.username }, JWT_SECRET, { expiresIn: "24h" });
                response.json({ token, username: username });
            }
        }).catch(err => {
            response.status(500).send({
                message: `Failed to sign in (internal server error)`
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
                message: `Failed to get user with id ${id} (internal server error)`
            });
        });
};

exports.delete = (request, response) => {
    const id = request.params.id;

    User.findByIdAndDelete(id)
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
                message: `Failed to delete user with id ${id} (internal server error)`
            });
        });
};