import {Schema, model} from "mongoose";

const hostDataScheme = new Schema(
    {
        homeAddress:{
            type: String,
            required:  false,
            trim: true
        },
        awayAddress: {
            type: String,
            required:  false,
            trim: true
        },
        drawAddress: {
            type: String,
            require: false,
            trim: true
        },
        homeName:{
            type: String,
            required: false,
            trim: true
        },
        awayName: {
            type: String,
            required:  false,
            trim: true
        },
        drawName: {
            type: String,
            required:  false,
            trim: true
        },
        //current lead mod
        host: {
            type: Object,
            require: false,
            trim: true
        },
        stopBets:{
            type: Boolean,
            require: false,
        },
        whiteList: {
            type: Object,
            require: false
        }
    },
    {
        collection: "eCashBet_hostData",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("hostData", hostDataScheme)