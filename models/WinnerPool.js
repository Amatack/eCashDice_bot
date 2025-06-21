import {Schema, model} from "mongoose";

const WinnerPoolScheme = new Schema(
    {
        name:{
            type: String,
            required:  false,
            trim: true
        },
        teamName:{
            type: String,
            required:  false,
            trim: true
        },
        totalPoolsBetWithoutVigorish: {
            type: Number,
            required:  true,
            trim: true
        },
        withDiceService:{
            type: Boolean,
            required: false,
            trim: true
        }
    },
    {
        collection: "eCashBet_winnerPool",
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("WinnerPool", WinnerPoolScheme)