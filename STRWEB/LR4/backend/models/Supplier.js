module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            name: { 
                type: String,
                required: true
            },
            phone: { 
                type: String,
                required: true
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