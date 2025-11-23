module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            username: { 
                type: String,
                required: true,
                unique: true
            },
            email: {
                type: String,
                required: true,
                unique: true,
                match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
            },
            password: { 
                type: String,
                required: false
            },
            googleID: { 
                type: String,
                required: false,
                validate: {
                    validator: function(value) {
                        if (value === null) return true;
                        return new Promise(async (resolve) => {
                            const existing = await mongoose.model('user').findOne({ googleID: value });
                            resolve(!existing);
                        });
                    },
                    message: 'Google ID already exists'
                }
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