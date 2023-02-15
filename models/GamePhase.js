import {Schema, model} from "mongoose";

const GamePhaseScheme = new Schema(
    {
        gamePhase:{
            type: String,
            required: false,
        }
    },
    {
        collection: "gamePhase",
        timestamps: false, //TODO createdAt, updatedAt
        versionKey: false
    }
)

export default model("GamePhase", GamePhaseScheme)