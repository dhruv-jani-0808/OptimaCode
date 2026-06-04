const dns = require('node:dns/promises');
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Forces Cloudflare & Google DNS

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('../models/Problem.js');

dotenv.config();

const platformProblems = [
    {
        title: "Two Sum",
        difficulty: "Easy",
        topic: ["Array", "Hash Table"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ],
        boilerplate: {
            javascript: "function twoSum(nums, target) {\n    // Write your code here\n};",
            python: "def twoSum(nums, target):\n    # Write your code here\n    pass",
            cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
        },
        editorialCode: {
            javascript: "function twoSum(nums, target) {\n    const map = new Map();\n    for(let i = 0; i < nums.length; i++) {\n        let diff = target - nums[i];\n        if(map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n};",
            python: "def twoSum(nums, target):\n    map = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in map:\n            return [map[diff], i]\n        map[num] = i\n    return []",
            cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for(int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if(map.count(diff)) return {map[diff], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};"
        }
    },
    {
        title: "Reverse String",
        difficulty: "Easy",
        topic: ["Two Pointers", "String"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
        examples: [
            { input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
            { input: "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", output: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" }
        ],
        boilerplate: {
            javascript: "function reverseString(s) {\n    // Write your code here\n};",
            python: "def reverseString(s):\n    # Write your code here\n    pass",
            cpp: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};"
        },
        editorialCode: {
            javascript: "function reverseString(s) {\n    let left = 0, right = s.length - 1;\n    while(left < right) {\n        let temp = s[left];\n        s[left++] = s[right];\n        s[right--] = temp;\n    }\n};",
            python: "def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1",
            cpp: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        int left = 0, right = s.size() - 1;\n        while(left < right) {\n            swap(s[left++], s[right--]);\n        }\n    }\n};"
        }
    },
    {
        title: "Container With Most Water",
        difficulty: "Medium",
        topic: ["Array", "Two Pointers", "Greedy"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49." }
        ],
        boilerplate: {
            javascript: "function maxArea(height) {\n    // Write your code here\n};",
            python: "def maxArea(height):\n    # Write your code here\n    pass",
            cpp: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};"
        },
        editorialCode: {
            javascript: "function maxArea(height) {\n    let maxArea = 0, left = 0, right = height.length - 1;\n    while(left < right) {\n        let area = Math.min(height[left], height[right]) * (right - left);\n        maxArea = Math.max(maxArea, area);\n        if(height[left] < height[right]) left++;\n        else right--;\n    }\n    return maxArea;\n};",
            python: "def maxArea(height):\n    max_area, left, right = 0, 0, len(height) - 1\n    while left < right:\n        area = min(height[left], height[right]) * (right - left)\n        max_area = max(max_area, area)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_area",
            cpp: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int maxArea = 0, left = 0, right = height.size() - 1;\n        while(left < right) {\n            int area = min(height[left], height[right]) * (right - left);\n            maxArea = max(maxArea, area);\n            if(height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxArea;\n    }\n};"
        }
    },
    {
        title: "Longest Common Subsequence",
        difficulty: "Medium",
        topic: ["String", "Dynamic Programming"],
        timeComplexity: "O(m*n)",
        spaceComplexity: "O(m*n)",
        description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
        examples: [
            { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3", explanation: "The longest common subsequence is \"ace\" and its length is 3." },
            { input: "text1 = \"abc\", text2 = \"abc\"", output: "3", explanation: "The longest common subsequence is \"abc\" and its length is 3." }
        ],
        boilerplate: {
            javascript: "function longestCommonSubsequence(text1, text2) {\n    // Write your code here\n};",
            python: "def longestCommonSubsequence(text1, text2):\n    # Write your code here\n    pass",
            cpp: "class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        \n    }\n};"
        },
        editorialCode: {
            javascript: "function longestCommonSubsequence(text1, text2) {\n    const dp = Array(text1.length + 1).fill(0).map(() => Array(text2.length + 1).fill(0));\n    for (let i = 1; i <= text1.length; i++) {\n        for (let j = 1; j <= text2.length; j++) {\n            if (text1[i - 1] === text2[j - 1]) {\n                dp[i][j] = dp[i - 1][j - 1] + 1;\n            } else {\n                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n    }\n    return dp[text1.length][text2.length];\n};",
            python: "def longestCommonSubsequence(text1, text2):\n    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]\n    for i in range(1, len(text1) + 1):\n        for j in range(1, len(text2) + 1):\n            if text1[i - 1] == text2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[len(text1)][len(text2)]",
            cpp: "class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        vector<vector<int>> dp(text1.size() + 1, vector<int>(text2.size() + 1, 0));\n        for(int i = 1; i <= text1.size(); i++) {\n            for(int j = 1; j <= text2.size(); j++) {\n                if(text1[i - 1] == text2[j - 1]) {\n                    dp[i][j] = dp[i - 1][j - 1] + 1;\n                } else {\n                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n                }\n            }\n        }\n        return dp[text1.size()][text2.size()];\n    }\n};"
        }
    },
    {
        title: "Course Schedule",
        difficulty: "Medium",
        topic: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V + E)",
        description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nReturn true if you can finish all courses. Otherwise, return false.",
        examples: [
            { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible." },
            { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible." }
        ],
        boilerplate: {
            javascript: "function canFinish(numCourses, prerequisites) {\n    // Write your code here\n};",
            python: "def canFinish(numCourses, prerequisites):\n    # Write your code here\n    pass",
            cpp: "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        \n    }\n};"
        },
        editorialCode: {
            javascript: "function canFinish(numCourses, prerequisites) {\n    let inDegree = new Array(numCourses).fill(0);\n    let adjList = new Array(numCourses).fill(0).map(() => []);\n    for (let [course, pre] of prerequisites) {\n        adjList[pre].push(course);\n        inDegree[course]++;\n    }\n    let queue = [];\n    for (let i = 0; i < numCourses; i++) {\n        if (inDegree[i] === 0) queue.push(i);\n    }\n    let count = 0;\n    while (queue.length) {\n        let current = queue.shift();\n        count++;\n        for (let next of adjList[current]) {\n            inDegree[next]--;\n            if (inDegree[next] === 0) queue.push(next);\n        }\n    }\n    return count === numCourses;\n};",
            python: "def canFinish(numCourses, prerequisites):\n    from collections import deque\n    adj = [[] for _ in range(numCourses)]\n    indegree = [0] * numCourses\n    for course, pre in prerequisites:\n        adj[pre].append(course)\n        indegree[course] += 1\n    queue = deque([i for i in range(numCourses) if indegree[i] == 0])\n    count = 0\n    while queue:\n        curr = queue.popleft()\n        count += 1\n        for neighbor in adj[curr]:\n            indegree[neighbor] -= 1\n            if indegree[neighbor] == 0:\n                queue.append(neighbor)\n    return count == numCourses",
            cpp: "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<vector<int>> adj(numCourses);\n        vector<int> indegree(numCourses, 0);\n        for(auto& pre : prerequisites) {\n            adj[pre[1]].push_back(pre[0]);\n            indegree[pre[0]]++;\n        }\n        queue<int> q;\n        for(int i = 0; i < numCourses; i++) {\n            if(indegree[i] == 0) q.push(i);\n        }\n        int count = 0;\n        while(!q.empty()) {\n            int curr = q.front();\n            q.pop();\n            count++;\n            for(int next : adj[curr]) {\n                indegree[next]--;\n                if(indegree[next] == 0) q.push(next);\n            }\n        }\n        return count == numCourses;\n    }\n};"
        }
    }
];

// Database Execution Pipeline
const seedDatabase = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/optimacode');
        
        console.log("🗑️ Wiping out old, placeholder questions...");
        await Problem.deleteMany({});
        
        console.log(`📥 Injecting ${platformProblems.length} real LeetCode-style challenges...`);
        await Problem.insertMany(platformProblems);
        
        console.log("🚀 Database successfully seeded! Fresh data is ready to use.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding process caught an error:", error);
        process.exit(1);
    }
};

seedDatabase();