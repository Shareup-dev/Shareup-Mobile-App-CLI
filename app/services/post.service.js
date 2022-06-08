import AuthAxios from './authAxios';

class PostService {
  getNewsFeed = email => AuthAxios.get(`new_newsFeed/${email}`);
  createPost = (uid, data, onUploadProgress, onDownloadProgress) =>
    AuthAxios({
      method: 'post',
      url: `new_post/${uid}`,
      data,
    });
  getPostByEmail = (email, config) =>
    AuthAxios.get(`posts/email/${email}`, config);
  getPostByPostId = pid => AuthAxios.get(`posts/post-by-id/${pid}`);
  getSavedPost = uid => AuthAxios.get(`${uid}/getSavedPosts`);
  deletePost = postId => AuthAxios.delete(`posts/${postId}`);
  editPost = (postId, data) => AuthAxios.put(`posts/${postId}`, data);
  getPosts = () => AuthAxios.get(`posts`);
  likePost = (uid, pid, emoji) =>
    AuthAxios.put(`${uid}/like-unlike/${pid}`, {emoji: emoji});
  

  sharePost = (uid, pid, data) => AuthAxios.post(`share/${uid}/${pid}`, data);
  getSharedPostById = id => AuthAxios.get(`share/${id}`);

  /*********************** COMMON FOR ALL POST ************************/

  likePost = (uid, pid, emoji) =>
    AuthAxios.put(`${uid}/like-unlike/${pid}`, {emoji: emoji});
  deletePost = postId => AuthAxios.delete(`allpost/${postId}`);
  savePost = (uid, pid) => AuthAxios.put(`allposts/${uid}/save-unsave/${pid}`);
  /******************** COMMENT *******************/
  addComment = (userid, postid, comment) =>
    AuthAxios.post(`comment/${userid}/${postid}`, comment);
  deleteComment = commentid => AuthAxios.delete(`comment/delete/${commentid}`);
  likeUnlikeComment = (uid, cid, params) =>
    AuthAxios.put(`comment/${uid}/like-unlike/${cid}`, params);
  editComment = (cid, comment) =>
    AuthAxios({
      method: 'PUT',
      url: `comment/Edit_comment/${cid}`,
      params: {
        content: comment,
      },
    });
  getAllComments = (uid, pid) =>
    AuthAxios.get(`comment/${uid}/get_comments/${pid}`);

  /******************** REPLY *******************/

  deleteReply = rid => AuthAxios.delete(`reply/delete/${rid}`);
  replay = (uid, commentId, data) =>
    AuthAxios.post(`comment/reply/${uid}/${commentId}`, data);
  likeUnlikeReply = (uid, rid, params) =>
    AuthAxios.put(`reply/${uid}/like-unlike/${rid}`, params);
  editReply = (rid, reply) =>
    AuthAxios({
      method: 'PUT',
      url: `reply/edit/${rid}`,
      params: {
        content: reply,
      },
    });
  getAllReply = (uid, cid) =>
    AuthAxios.get(`comment/${uid}/get_replies/${cid}`);
}
const config = {
  onUploadProgress: progressEvent => {
    progress = (progressEvent.loaded / progressEvent.total) * 50;
  },
  onDownloadProgress: progressEvent => {
    progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
  },
};
export default new PostService();
