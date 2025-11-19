module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            username: { 
                type: String,
                required: true
            },
            password: { 
                type: String,
                required: false
            },
            googleID: { 
                type: String,
                required: false
            }
        }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    })

    const User = mongoose.model("user", schema);
    return User;
}