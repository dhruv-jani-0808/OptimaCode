const dns = require('node:dns/promises');
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Forces Cloudflare & Google DNS

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// routers
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (req, res) => {
    res.send('OptimaCode backend API is running ...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});