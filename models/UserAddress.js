import {Schema, model} from "mongoose";

const userAddressScheme = new Schema(
    {
        tgId:{
            type: Number,
            required:  true,
            trim: true
        },
        address:{
            type: String,
            required:  false,
            trim: true
        }
    },
    {
        collection: "userAddress",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("UserAddress", userAddressScheme)