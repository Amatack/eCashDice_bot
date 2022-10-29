import {Schema, model} from "mongoose";

const TemporaryRafflesScheme = new Schema(
    {
        url:{
            type: String,
            required:  true,
            trim: true
        },
        participants:{
            type: Number,
            required: true,
            trim: true,
        },
        userBlock:{
            type:Number,
            required: true,
            trim: true,
        },
        participations:{
            type: Array,
            required: true,
            trim: true,
        }
    },
    {
        collection: "temporaryRaffles",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("TemporaryRaffles", TemporaryRafflesScheme)