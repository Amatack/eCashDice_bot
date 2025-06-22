import {Schema, model} from "mongoose";

const SlotGameWinnerScheme = new Schema(
    {
        tgId:{
            type: Number,
            required:  true,
            trim: true
        }
    },
    {
        collection: "slotGame_winners",
        timestamps: true, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("SlotGameWinner", SlotGameWinnerScheme)