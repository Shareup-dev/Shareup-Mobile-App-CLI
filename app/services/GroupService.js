import axios from 'axios';
import settings from '../config/settings';
import AuthService from './old/auth.services';

const baseUrl = `${settings.apiUrl}/api/v1/groups`;
let authAxios = null;

const authenticate = async () => {
  await AuthService.getCurrentUser().then(
    res => {
      authAxios = axios.create({
        baseURL: baseUrl,
        headers: {
          Authorization: `Bearer ${res.userToken}`,
          'Access-Control-Allow-Origin': '*',
        },
      });
    },
    error => {
      console.log(error);
    },
  );
};
authenticate();

class GroupService {
  createGroup = async (uid, formdata) => {
    try {
      const result = await authAxios.post(`/${uid}/create`, formdata);
      return result;
    } catch (error) {
      console.log('An error occured while creating group: ', error);
    }
  };

  createGroupPost = async (uid, groupDetails) => {
    try {
      const result = await authAxios.post(`/ ${uid} / create`, groupDetails);
      return result;
    } catch (error) {
      console.log('An error occured while creating group: ', error);
      return false;
    }
  };

  getAllGroups = async () => {
    authenticate();
    const result = await authAxios.get('');
    return result;
  };

  getGroupById = async id => {
    const result = await authAxios.get(`/ id / ${id}`);
    return result;
  };

  getGroupByCurrentUser = async email => {
    const result = await authAxios.get(`/ email / ${email}`);
    return result;
  };

  getGroupsPostsById = async id => {
    const result = await authAxios.get(`/posts/${id}`);
    return result;
  };
  getUserGroups = async email => {
    console.log(
      'Sending request to: ',
      `${settings.apiUrl}/api/v1/${email}/groups`,
    );
    const result = await authAxios.get(
      `${settings.apiUrl}/api/v1/${email}/groups`,
    );
    return result;
  };
  joinGroup = async (uid, gid) => {
    const result = await authAxios.post(`/${uid}/join/${gid}`);
    return result;
  };

  leaveGroup = async (uid, gid) => {
    const result = await authAxios.delete(`/ ${uid} / leave / ${gid}`);
    return result;
  };
}

export default new GroupService();

