import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        
       
        title: {
            type: String,
            required: true,
            trim: true
        },
        
        category: {
            type: String,
            enum: ["Wellness", "Mindfulness", "Activity", "Social"],
            default: "Wellness"
        },

        isCompleted: {
            type: Boolean,
            default: false
        },
        
        assignedDate: {
            type: Date,
            default: Date.now,
        }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model("Task", taskSchema);