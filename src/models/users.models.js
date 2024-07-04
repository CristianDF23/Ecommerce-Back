import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            require: true
        },
        first_name: {
            type: String,
            require: true
        },
        last_name: {
            type: String,
            require: true
        },
        phone: {
            type: Number,
        },
        age: {
            type: Number,
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'carts',
            require: true
        },
        documents: {
            type: [
                {
                    name: {
                        type: String,
                    },
                    reference: {
                        type: String,
                    }
                }
            ]
        },
        last_connection: {
            type: String,
        }
    },
    {
        strict: false,
    }
);

export default model("users", UserSchema);