const { SchemaTypes } = require("mongoose");

module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            productID: { 
                type: SchemaTypes.ObjectId,
                required: true
            },
            supplierID: { 
                type: SchemaTypes.ObjectId,
                required: true
            },
            price: { 
                type: Number,
                required: true,
                min: [0.01, 'Price must be greater than 0']
            },
            count: { 
                type: Number,
                required: true,
                min: [1, 'Count must be at least 1']
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