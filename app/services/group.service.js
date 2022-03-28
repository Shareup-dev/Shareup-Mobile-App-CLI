import AuthAxios from './authAxios';

class GroupService {
  // main actions
  createGroup = (oid, data) => AuthAxios.post(`groups/${oid}/create`, data);
  deleteGroup = (oid, gid) => AuthAxios.delete(`groups/${oid}/delete/${gid}`);
  getGroupById = gid => AuthAxios.get(`groups/id/${gid}`);
  getAllGroups = () => AuthAxios.get(`groups`);
  groupSuggestion = uid => AuthAxios.get(`groups/suggestion/${uid}`);
  addGroupImage = (gid, data) => AuthAxios.post(`groups/upload_image/${gid}`, data);
  
  // group Admin  
  addAdmin = (gid, aid) => AuthAxios.post(`groups/${gid}/add_admin/${aid }`);
  getGroupsOfOwner = oid => AuthAxios.get(`groups/group_id/${oid}`);

  // members
  getMembers = gid => AuthAxios.get(`groups/${gid}/members`);
  getUserGroups = email => AuthAxios.get(`${email}/groups`);
  leavegroup = (uid, gid) => AuthAxios.delete(`groups/${uid}/leave/${gid}`);
  checkIsMember = (gid, uid) => AuthAxios.get(`groups/${uid}/is_member/${gid}`);
  addMember = (uid, gid) => AuthAxios.post(`groups/${uid}/join/${gid}`);
  
  // join requests
  joinRequest = (uid,gid) => AuthAxios.post(`groups/${uid}/Join_group/${gid}`);
  acceptMemberRequest = rid => AuthAxios.put(`groups/accept_member_requests/${rid}`);
  rejectMemberRequest = rid => AuthAxios.put(`groups/reject_member_request/${rid}`);
  listOfRequests = (gid) => AuthAxios.get(`groups/${gid}/member_requests`);
  
  // post
  getPostByUserId = uid => AuthAxios.get(`groups/posts_user_group/${uid}`);
  getGroupPost = gid => AuthAxios.get(`groups/posts/${gid}`);
  
  // invitations
  inviteToJoin = (gid, uid, fid) => AuthAxios.post(`groups/${gid}/${uid}/invite/${fid}`);
  acceptInvitation = rid => AuthAxios.put(`groups/accept_invite/${rid}`);
  rejectInvitation = rid => AuthAxios.put(`groups/reject_invite/${rid}`);
  
}

export default new GroupService();
