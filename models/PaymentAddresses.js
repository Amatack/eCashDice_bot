import {Schema, model} from "mongoose";

const paymentAddressesScheme = new Schema(
    {
        telegramId:{
            type: Number,
            required:  true,
            trim: true
        },
        address:{
            type: String,
            required: true,
            trim: true,
        },
        paymentReason:{
            type: String,
            required: true,
            trim: true,
        },
        amount:{
            type: Number,
            required: false,
            trim: true,
        }
    },
    {
        collection: "paymentAddresses",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("Addresses", paymentAddressesScheme)