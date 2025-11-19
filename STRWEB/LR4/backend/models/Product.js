module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            title: { 
                type: String,
                required: true
            },
            description: { 
                type: String,
                required: true
            },
            price: { 
                type: Number,
                required: true
            },
            partNumber: { 
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

    const Product = mongoose.model("product", schema);
    return Product;
}