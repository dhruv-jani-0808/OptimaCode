const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, unique: true },
    difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'], trim: true },
    description: { type: String, required: true, trim: true },
    topic: [{ type: String, trim: true }],
    
    // Time & Space expected complexities
    timeComplexity: { type: String, trim: true },
    spaceComplexity: { type: String, trim: true },
    
    // Examples used for UI display AND execution verification (if no hidden testCases are used)
    examples: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            explanation: { type: String }
        }
    ],
    
    // Starting code for the user
    boilerplate: {
        javascript: { type: String },
        python: { type: String },
        cpp: { type: String },
        java: { type: String },
        c: { type: String }
    },
    
    // The official solution code to display in the Editorial tab
    editorialCode: {
        javascript: { type: String },
        python: { type: String },
        cpp: { type: String },
        java: { type: String },
        c: { type: String }
    }
}, { timestamps: true });

const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
module.exports = Problem;