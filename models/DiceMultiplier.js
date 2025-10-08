import {Schema, model} from "mongoose";

const DiceMultiplierScheme = new Schema(
    {
        //user with possible multiplier
        tgId:{
            type: Number,
            required:  true,
            trim: true
        },
        multiplier:{
            type: Boolean,
            required: true
        },
        // Assigned eCash address used for the multiplier payment flow
        address: {
            type: String,
            required: false,
            trim: true
        }
    },
    {
        collection: "diceGame_Multiplier",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("DiceMultiplier", DiceMultiplierScheme)