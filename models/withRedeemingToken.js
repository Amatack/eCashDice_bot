import {Schema, model} from "mongoose";

const withRedeemingTokenScheme = new Schema(
    {
        address:{
            type: String,
            required:  false,
            trim: true
        },
        tokenId:{
            type: String,
            required:  false,
            trim: true
        }
    },
    {
        collection: "eCashBet_withRedeemingToken",
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("WithRedeemingToken", withRedeemingTokenScheme)