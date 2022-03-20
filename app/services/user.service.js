import AuthAxios from './authAxios';

class UserService {
  getUserByEmail = email => AuthAxios.get(`/users/email/${email}`);
  getUsers = () => AuthAxios.get(`/users`);
  editProfile = (email, user) => AuthAxios.put(`users/${email}/edit_profile`, user);
  getUserById = userId => AuthAxios.get(`users/${userId}`);
  getFriends = email => AuthAxios.get(`/friends/email/${email}`);
  getFollowers = email => AuthAxios.get(`${email}/followers`);
  getFollowing = email => AuthAxios.get(`${email}/following`);
  getFriendRequestSent = email => AuthAxios.get(`${email}/friend_request_sent`);
  getFriendRequestRecieved = email =>AuthAxios.get(`${email}/friend_request_recieved`);
  follow = (email, followed_id) => AuthAxios.post(`${email}/follows/${followed_id}`);
  unfollow = (email, followed_id) => AuthAxios.delete(`${email}/unfollow/${followed_id}`);
  uploadProfilePicture = (email, formdata) => AuthAxios.post(`users/${email}/upload_profile_picture`, formdata);
  uploadCoverPicture = (email, formdata) => AuthAxios.post(`users/${email}/upload_cover_picture`, formdata);
  likePost = (uid, pid) => AuthAxios.put(`/posts/${uid}/like-unlike/${pid}`, {emoji: 'like',});
  savePost = (uid, pid) => AuthAxios.put(`/posts/${uid}/save-unsave/${pid}`);
}

export default new UserService();
