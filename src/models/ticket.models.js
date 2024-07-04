import {Schema, model} from 'mongoose'

const TicketSchema = new Schema(
    {
        codeTicket: {
            type: String,
            unique: true,
            required: true
        },
        purchase_datetime: {
            type: String,
        },
        amount: {
            type: Number,
        },
        purchaser: {
            type: String,
        },
        cart:{
            type: String,
        },
        shippingDetail: {
            type: Object
        }
    },
    {
        strict: false,
    }
);

export default model("tickets", TicketSchema);