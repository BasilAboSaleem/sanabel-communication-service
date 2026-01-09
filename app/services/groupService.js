const groupRepository = require('../repositories/groupRepository');

class GroupService {
  async createGroup({ name, type, scope }, user) {
    return groupRepository.create({
      name,
      type,
      scope,
      createdBy: user.id,
      admins: [user.id],
      members: [user.id],
    });
  }

  getMyGroups(userId) {
    return groupRepository.findByUser(userId);
  }

  addMember(groupId, targetUserId) {
    return groupRepository.addMember(groupId, targetUserId);
  }

  removeMember(groupId, targetUserId) {
    return groupRepository.removeMember(groupId, targetUserId);
  }
}

module.exports = new GroupService();
