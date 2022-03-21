import AuthAxios from './authAxios';

class GroupService {
  createGroup = (oid, data) => AuthAxios.post(`/groups/${oid}/create`, data);
  addMember = (uid, gid) => AuthAxios.post(`/groups/${uid}/join/${gid}`);
  getMembers = gid => AuthAxios.get(`/groups/${gid}/members`);
  createAdmin = (gid, aid) => AuthAxios.post(`/groups/${gid}/add_admin/${aid}`);
  deleteGroup = (oid, gid) => AuthAxios.delete(`/groups/${oid}/delete/${gid}`);
  leaveGroup = (uid, gid) => AuthAxios.delete(`/groups/${uid}/leave/${gid}`);
  getPostByUserId = uid => AuthAxios.get(`/groups/posts_user_group/${uid}`);
  getGroupPost = gid => AuthAxios.get(`/groups/posts/${gid}`);
  getGroupsOfOwner = oid => AuthAxios.get(`/groups/group_id/${oid}`);
  getGroupById = gid => AuthAxios.get(`/groups/id/${id}`);
  getAllGroups = () => AuthAxios.get(`/groups`);
  inviteToJoin = (gid, uid, fid) =>
    AuthAxios.post(`/groups/${gid},${uid}/invite/${fid}`);
  acceptInvitation = rid => AuthAxios.put(`/groups/accept_invite/${rid}`);
  rejectInvitation = rid => AuthAxios.put(`/groups/reject_invite/${rid}`);
  getMemberRequests = gid => AuthAxios.get(`/groups/${gid}/member_requests`);
  acceptMemberRequest = rid =>
    AuthAxios.put(`/groups/accept_member_requests/${rid}`);
  rejectMemberRequest = rid =>
    AuthAxios.put(`/groups/reject_member_request/${rid}`);
}

export default new GroupService();
