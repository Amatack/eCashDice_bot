import {Schema, model} from "mongoose";

const RejectedBetScheme = new Schema(
    {
        address:{
            type: String,
            required:  false,
            trim: true
        },
        amount: {
            type: Number,
            required:  true,
            trim: true
        },
    },
    {
        collection: "eCashBet_rejectedBet",
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("RejectedBet", RejectedBetScheme)