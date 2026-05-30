const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const axios = require('axios');

const LANGUAGE_MAPPING = {
    'python':     { language: "python3", versionIndex: "4", schemaName: "Python" },
    'javascript': { language: "nodejs",  versionIndex: "4", schemaName: "JavaScript" },
    'java':        { language: "java",    versionIndex: "4", schemaName: "Java" },
    'c':           { language: "c",       versionIndex: "5", schemaName: "C" },
    'cpp':         { language: "cpp17",   versionIndex: "1", schemaName: "C++" },
};

const createSubmission = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        if(!problemId || !code || !language) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const config = LANGUAGE_MAPPING[language.toLowerCase()];
        if (!config) {
            return res.status(400).json({ message: 'Unsupported language selection' });
        }

        const inputData = problem.testCases && problem.testCases.length > 0 
            ? problem.testCases[0].input 
            : "";

        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: code,
            language: config.language,
            versionIndex: config.versionIndex,
            stdin: inputData
        });

        const stdout = response.data.output || '';
        const cpuTime = response.data.cpuTime || '0';
        const memory = response.data.memory || 0;
        
        const actualOutput = stdout.trim();
        const expectedOutput = problem.testCases && problem.testCases.length > 0 
            ? problem.testCases[0].expectedOutput.trim() 
            : "";

        let status;
        if(response.data.statusCode !== 200) {
            status = "Compilation Error";
        }
        else if(actualOutput === expectedOutput) {
            status = "Accepted";
        }
        else {
            status = "Wrong Answer";
        }

        const submission = new Submission({
            userId: req.user._id,
            problemId: problem._id,
            code,
            language: config.schemaName,
            status, 
            runtime: Number(cpuTime) || 0,
            memory,
            stdout,
            stderr: response.data.statusCode !== 200 ? stdout : ''
        });

        await submission.save();

        res.status(201).json({ 
            message: 'Code evaluated and submission recorded!', 
            submission 
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(submissions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubmission,
    getUserSubmissions
};