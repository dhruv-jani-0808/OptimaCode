const dns = require('node:dns/promises');
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Forces Cloudflare & Google DNS

const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();
const connectDB = require('../config/db');

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    topic: ['Array', 'Hash Table'],
    optimalTime: 'O(n)',
    optimalSpace: 'O(n)',
    editorialCode: '// C++ Solution\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Logic\n    }\n};',
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0, 1]'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1, 2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0, 1]'
      },
      {
        input: 'nums = [1,2,3,4,5], target = 10',
        expectedOutput: '[]'
      }
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    topic: ['String', 'Hash Table', 'Sliding Window'],
    optimalTime: 'O(n)',
    optimalSpace: 'O(min(m, n))',
    editorialCode: '// C++ Solution\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Logic\n    }\n};',
    testCases: [
      {
        input: 's = "abcabcbb"',
        expectedOutput: '3'
      },
      {
        input: 's = "bbbbb"',
        expectedOutput: '1'
      },
      {
        input: 's = "pwwkew"',
        expectedOutput: '3'
      }
    ]
  }
];

const seedProblems = async () => {
  try {
    await connectDB();
    await Problem.deleteMany({});
    await Problem.insertMany(problems);

    console.log('Problems seeded successfully!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    
    mongoose.connection.close();
    process.exit(1);
  }
};

seedProblems();