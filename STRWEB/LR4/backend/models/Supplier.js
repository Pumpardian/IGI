module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            name: { 
                type: String,
                required: true
            },
            phone: { 
                type: String,
                required: true,
                unique: true,
                match: [/^((\+375|80)\s?\(?\d{2}\)?|8\s?\(?\d{3}\)?)\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/, 'Please enter a valid phone']
            },
            address: { 
                type: String,
                required: true
            }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    })

    const Supplier = mongoose.model("supplier", schema);
    return Supplier;
}