import axios, { Axios } from 'axios';
import AuthAxios from './authAxios';

class GroupService {
  createGroup = (oid,groupName,description,privacy,visibility) =>
    AuthAxios.post(`/groups/${oid}/create`,{
        group_name : groupName,
        description : description,
        privacy_option : privacy,
        visibility_option : visibility
    })
  addMember = (uid,gid) =>
    AuthAxios.post(`/groups/${uid}/join/${gid}`)
  getMembers = (gid) =>
    AuthAxios.get(`/groups/${gid}/members`)
  createAdmin = (gid,aid) =>
    AuthAxios.post(`/groups/${gid}/add_admin/${aid}`)
  deleteGroup = (oid,gid) =>
    AuthAxios.delete(`/groups/${oid}/delete/${gid}`)
  leavegroup = (uid,gid) =>
    AuthAxios.delete(`/groups/${uid}/leave/${gid}`)
  getPostByUserd = (uid) =>
    AuthAxios.get(`/groups/posts_user_group/${uid}`)
  getGroupPost = (gid) =>
    AuthAxios.get(`/groups/posts/${gid}`)
  getGroupsOfOwner = (oid) =>
    AuthAxios.get(`/groups/group_id/${oid}`)
  getGroupById = (gid) =>
    AuthAxios.get(`/groups/id/${id}`)
}