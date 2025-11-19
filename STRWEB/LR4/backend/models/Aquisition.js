module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            productID: { 
                type: String,
                required: true
            },
            supplierID: { 
                type: String,
                required: true
            },
            price: { 
                type: Number,
                required: true
            },
            count: { 
                type: Number,
                required: true
            },
            date: { 
                type: Date,
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

    const Aquisition = mongoose.model("aquisition", schema);
    return Aquisition;
}