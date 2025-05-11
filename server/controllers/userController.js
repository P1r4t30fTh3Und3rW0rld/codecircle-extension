const axios = require('axios');
const User = require('../models/User');

// 🔗 Link a LeetCode account
exports.linkLeetCodeAccount = async (req, res) => {
  const { leetcodeUsername } = req.body;

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username: leetcodeUsername }
    });

    const userData = response.data.data.matchedUser;

    if (!userData) {
      return res.status(404).json({ message: "LeetCode user not found" });
    }

    const problemsSolved = userData.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'All').count;

    const user = await User.findOneAndUpdate(
      { leetcodeUsername },
      { leetcodeUsername, problemsSolved },
      { new: true, upsert: true }
    );

    res.json({ leetcodeUsername: user.leetcodeUsername, problemsSolved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch LeetCode data" });
  }
};

// 📋 Get all linked LeetCode accounts
exports.getAllLinkedAccounts = async (req, res) => {
  try {
    const users = await User.find({}, 'leetcodeUsername');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch accounts' });
  }
};
exports.deleteLeetCodeAccount = async (req, res) => {
  const { _id } = req.params;

  try {
    const deleted = await User.findOneAndDelete({ _id });
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Account removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};