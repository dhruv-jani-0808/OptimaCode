const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    topic: [
        {
            type: String,
            trim: true
        }
    ],
    difficulty: {
        type: String,
        required: [true, 'Difficulty is required'],
        enum: ['Easy', 'Medium', 'Hard'],
        trim: true
    },
    optimalTime: {
        type: String,
        required: [true, 'Time complexity is required'],
        trim: true
    },
    optimalSpace: {
        type: String,
        required: [true, 'Space complexity is required'],
        trim: true
    },
    editorialCode: {
        type: String,
        required: [true, 'Editorial code is required'],
        trim: true
    },
    testCases: [
        {
            input: {
                type: String,
                required: [true, 'Test case input is required']
            },
            expectedOutput: {
                type: String,
                required: [true, 'Test case expected output is required']
            }
        }
    ]
},
{
    timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;