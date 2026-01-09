const groupService = require('../services/groupService');

exports.createGroup = async (req, res) => {
  try {
    const group = await groupService.createGroup(req.body, req.user);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.myGroups = async (req, res) => {
  try {
    const groups = await groupService.getMyGroups(req.user.id);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await groupService.addMember(groupId, userId);
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
