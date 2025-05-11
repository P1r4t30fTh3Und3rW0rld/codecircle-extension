const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

// Create a new group
router.post('/create', async (req, res) => {
  const { groupName, userId } = req.body;

  if (!groupName || !userId) return res.status(400).json({ message: "Missing fields" });

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const group = new Group({ name: groupName, code, members: [userId] });
    await group.save();

    await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });

    res.json({ message: "Group created", code, groupId: group._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Group creation failed" });
  }
});

// Join a group
router.post('/join', async (req, res) => {
  const { code, userId } = req.body;

  try {
    const group = await Group.findOne({ code });

    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "Already a member" });
    }

    group.members.push(userId);
    await group.save();

    await User.findByIdAndUpdate(userId, { $push: { groups: group._id } });

    res.json({ message: "Joined group", groupId: group._id, groupName: group.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Joining failed" });
  }
});

module.exports = router;
