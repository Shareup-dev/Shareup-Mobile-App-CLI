import AuthAxios from './authAxios';

class UserService {
  getUserByEmail = email =>
    AuthAxios.get(`/users/email/${email}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getUsers = () =>
    AuthAxios.get(`/users`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  editProfile = (email, user) =>
    AuthAxios.put(`users/${email}/edit_profile`, user)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getUserById = userId =>
    AuthAxios.get(`users/${userId}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getFriends = email =>
    AuthAxios.get(`/friends/email/${email}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getFollowers = email =>
    AuthAxios.get(`${email}/followers`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getFollowing = email =>
    AuthAxios.get(`${email}/following`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getFriendRequestSent = email =>
    AuthAxios.get(`${email}/friend_request_sent`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getFriendRequestRecieved = email =>
    AuthAxios.get(`${email}/friend_request_recieved`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  follow = (email, followed_id) =>
    AuthAxios.post(`${email}/follows/${followed_id}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  unfollow = (email, followed_id) =>
    AuthAxios.delete(`${email}/unfollow/${followed_id}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  uploadProfilePicture = (email, formdata) =>
    AuthAxios.post(`users/${email}/upload_profile_picture`, formdata)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  uploadCoverPicture = (email, formdata) =>
    AuthAxios.post(`users/${email}/upload_cover_picture`, formdata)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  likePost = (uid, pid) =>
    AuthAxios.put(`/posts/${uid}/like-unlike/${pid}`, {
      emoji: 'like',
    })
      .then(res => res)
      .catch(e => {
        throw e;
      });

  savePost = (uid, pid) =>
    AuthAxios.put(`/posts/${uid}/save-unsave/${pid}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}

export default new UserService();
