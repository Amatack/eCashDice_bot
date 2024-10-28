import {Schema, model} from "mongoose";

const participantsScheme = new Schema(
    {
        eCashAddress:{
            type: String,
            required:  false,
            trim: true
        },
        amount: {
            type: Number,
            required:  true,
            trim: true
        },
        bettingReason: {
            type: String,
            require: true,
            trim: true
        },
        profit: {
            type: Number,
            require: false
        }
    },
    {
        collection: "participants",
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("Participants", participantsScheme)