import {Schema, model} from "mongoose";

const dartsGameStateScheme = new Schema(
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
        extraLife: {
            type: Boolean,
            required:  true,
            trim: true
        },
        phase: {
            type: String,
            require: true,
            trim: true 
        },
        played: {
            type: Boolean,
            required: false,
            trim: true
        },
    },
    {
        collection: "dartGame_state",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("DartsGameStateScheme", dartsGameStateScheme)