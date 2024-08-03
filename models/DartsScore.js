import {Schema, model} from "mongoose";

const dartsScoreScheme = new Schema(
    {
        tgId:{
            type: Number,
            required: true,
            trim: true,
        },
        name:{
            type: String,
            required: true,
            trim: true,
        },
        score: {
            type: Number,
            required:  false,
            trim: true
        },
        start: {
            type: Boolean,
            require: true,
            trim: true 
        }
    },
    {
        collection: "dartsScore",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("DartsScoreScheme", dartsScoreScheme)