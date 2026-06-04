const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const axios = require('axios');

const LANGUAGE_MAPPING = {
    'python':     { language: "python3", versionIndex: "4", schemaName: "Python" },
    'javascript': { language: "nodejs",  versionIndex: "4", schemaName: "JavaScript" },
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

        const inputData = problem.examples && problem.examples.length > 0 
            ? problem.examples[0].input 
            : "";

        let wrappedCode = code;

        if (language.toLowerCase() === 'javascript') {
            const match = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
            if (match) {
                const funcName = match[1];
                const argsString = match[2];
                const firstArg = argsString.split(',')[0].trim();
                
                wrappedCode += `\n\n// --- Execution Wrapper ---\n`;
                wrappedCode += `const fs = require('fs');\n`;
                wrappedCode += `const inputStr = fs.readFileSync(0, 'utf-8').trim();\n`;
                wrappedCode += `if (inputStr) {\n`;
                wrappedCode += `    const parts = inputStr.split(/,\\s*(?=[a-zA-Z_]+\\s*=)/);\n`;
                wrappedCode += `    for (let i = 0; i < parts.length; i++) { eval('var ' + parts[i]); }\n`;
                wrappedCode += `    const _result = ${funcName}(${argsString});\n`;
                wrappedCode += `    if (_result !== undefined) {\n`;
                wrappedCode += `        console.log(JSON.stringify(_result).replace(/\\s/g, ''));\n`;
                wrappedCode += `    } else {\n`;
                wrappedCode += `        console.log(JSON.stringify(${firstArg}).replace(/\\s/g, ''));\n`;
                wrappedCode += `    }\n`;
                wrappedCode += `}\n`;
            }
        } 
        else if (language.toLowerCase() === 'python') {
            const match = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/);
            if (match) {
                const funcName = match[1];
                const argsString = match[2];
                const firstArg = argsString.split(',')[0].trim();
                
                wrappedCode += `\n\n# --- Execution Wrapper ---\n`;
                wrappedCode += `import sys, json, re\n`;
                wrappedCode += `input_str = sys.stdin.read().strip()\n`;
                wrappedCode += `if input_str:\n`;
                wrappedCode += `    parts = re.split(r',\\s*(?=[a-zA-Z_]+\\s*=)', input_str)\n`;
                wrappedCode += `    for p in parts:\n`;
                wrappedCode += `        exec(p)\n`;
                wrappedCode += `    _result = ${funcName}(${argsString})\n`;
                wrappedCode += `    if _result is not None:\n`;
                wrappedCode += `        print(json.dumps(_result).replace(" ", ""))\n`;
                wrappedCode += `    else:\n`;
                wrappedCode += `        print(json.dumps(${firstArg}).replace(" ", ""))\n`;
            }
        }

        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: wrappedCode,
            language: config.language,
            versionIndex: config.versionIndex,
            stdin: inputData
        });

        const stdout = response.data.output || '';
        const cpuTime = response.data.cpuTime || '0';
        const memory = response.data.memory || 0;
        
        const actualOutput = stdout.trim();
        const expectedOutput = problem.examples && problem.examples.length > 0 
            ? problem.examples[0].output.trim() 
            : "";

        let status;
        if(response.data.statusCode !== 200) {
            status = "Compilation Error";
        }
        else if (Number(cpuTime) > 2.0) {
            status = "Time Limit Exceeded";
        }
        else if (Number(memory) > 128000) {
            status = "Memory Limit Exceeded";
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