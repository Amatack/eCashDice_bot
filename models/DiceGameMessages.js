import {Schema, model} from "mongoose";

const diceGameMessagesScheme = new Schema(
    {
        tgId:{
            type: Number,
            required:  true,
            trim: true
        },
        overGameMessageId:{
            type: Number,
            required:  true,
            trim: true
        }
    },
    {
        collection: "diceGameMessages",
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("DiceGameMessages", diceGameMessagesScheme)