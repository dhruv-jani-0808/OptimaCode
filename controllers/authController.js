const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const userAlreadyExists = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if(userAlreadyExists) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const userExists = await User.findOne({ email: email });
        if(!userExists) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const accessToken = jwt.sign(
            { userId: userExists._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )
        const refreshToken = jwt.sign(
            { userId: userExists._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        userExists.refreshToken = refreshToken;
        await userExists.save();

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: userExists._id,
                username: userExists.username,
                email: userExists.email
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const user = await User.findOne({ refreshToken: refreshToken });
        if(!user) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(decoded.userId !== user._id.toString()) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    
        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
    
        res.status(200).json({
            message: 'Access token refreshed successfully',
            accessToken: newAccessToken
        });
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid or Expired refresh token' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken
};