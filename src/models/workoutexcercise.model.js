import mongoose, { Schema } from "mongoose";

const workoutExerciseSchema = new Schema(
    {
        workout_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workout",
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
        repetitions: {
            type: Number,
            required: true
        },
        sets: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
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

export const WorkoutExercise = mongoose.model("WorkoutExercise", workoutExerciseSchema);