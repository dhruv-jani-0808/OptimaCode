const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: [true, 'Problem ID is required']
    },
    code: {
        type: String,
        required: [true, 'Code is required']
    },
    language: {
        type: String,
        required: [true, 'Programming language is required'],
        enum: ['JavaScript', 'Python', 'Java', 'C++', 'C'],
        trim: true
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error', 'Memory Limit Exceeded'],
        trim: true,
        default: 'Pending'
    },
    runtime: {
        type: Number,
        default: null
    },
    memory: {
        type: Number,
        default: null
    },
    stdout: {
        type: String,
        default: ''
    },
    stderr: {
        type: String,
        default: ''
    },
},
{
        timestamps: true
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;