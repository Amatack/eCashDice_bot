import {Schema, model} from "mongoose";

const userAddressesScheme = new Schema(
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
        },
        slotGameAddress: {
            type: String,
            required:  false,
            trim: true
        }
    },
    {
        collection: "communityChat_userAddresses",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("userAddresses", userAddressesScheme)