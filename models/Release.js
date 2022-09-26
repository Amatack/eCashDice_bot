import {Schema, model} from "mongoose";

const ReleaseScheme = new Schema(
    {
        idT:{
            type: Number,
            required:  true,
            trim: true
        },
        value:{
            type: Number,
            required:  true,
            trim: true
        }
    },
    {
        collection: "releases",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("Release", ReleaseScheme)