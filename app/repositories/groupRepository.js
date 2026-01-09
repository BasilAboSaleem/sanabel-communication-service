const Group = require('../models/Group');

class GroupRepository {
  create(data) {
    return Group.create(data);
  }

  findById(id) {
    return Group.findById(id);
  }

  findByUser(userId) {
    return Group.find({
      members: userId,
      isArchived: false,
    });
  }

  addMember(groupId, userId) {
    return Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );
  }

  removeMember(groupId, userId) {
    return Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    );
  }
}

module.exports = new GroupRepository();
