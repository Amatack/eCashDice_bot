import {Schema, model} from "mongoose";

const DirectionsUsingScheme = new Schema(
    {
        1:{
            type: Boolean,
            required:  true,
            trim: true
        },
        2:{
            type: Boolean,
            required:  true,
            trim: true
        },
        3:{
            type: Boolean,
            required:  true,
            trim: true
        },
        4:{
            type: Boolean,
            required:  true,
            trim: true
        },
        "getValues":{
            type: String,
            required: false,
        }
    },
    {
        collection: "directionsUsing",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("Availability", DirectionsUsingScheme)