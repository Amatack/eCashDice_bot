import {Schema, model} from "mongoose";

const DiceReleaseScheme = new Schema(
    {
        telegramId:{
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
        collection: "diceReleases",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("DiceRelease", DiceReleaseScheme)