import { Schema, model } from 'mongoose';

const carsSchema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ]
    }
});

carsSchema.pre('findOne', function () {
    this.populate('products.product');
});

export default model("carts", carsSchema);