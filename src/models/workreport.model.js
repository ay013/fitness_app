import mongoose, { Schema } from "mongoose";

const workoutReportSchema = new Schema(
    {
        workout_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workout",
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        details: {
            type: String,
            required: true
        },
        report_date: {
            type: Date,
            default: Date.now
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

export const WorkoutReport = mongoose.model("WorkoutReport", workoutReportSchema);