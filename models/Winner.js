import {Schema, model} from "mongoose";

const WinnersScheme = new Schema(
    {
        id:{
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
        collection: "winners",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("Winners", WinnersScheme)