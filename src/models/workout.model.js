import mongoose, { Schema } from "mongoose";

const workoutSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        comments: {
            type: String,
            trim: true
        },
        deleted_at: { type: Date, default: null },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' }
    }
);

export const Workout = mongoose.model("Workout", workoutSchema);