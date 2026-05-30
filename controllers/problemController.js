const Problem = require('../models/Problem');

const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({}).select('title difficulty topic');
        res.status(200).json(problems);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await Problem.findById(id).select('-editorialCode');
        if(!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(problem);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProblems,
    getProblemById
}