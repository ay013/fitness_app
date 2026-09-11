import mongoose, { Schema } from "mongoose";

const scheduledWorkoutSchema = new Schema(
    {
        workout_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workout",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "skipped"],
            default: "pending"
        },
        scheduled_date: {
            type: Date,
            required: true
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

export const ScheduledWorkout = mongoose.model("ScheduledWorkout", scheduledWorkoutSchema);