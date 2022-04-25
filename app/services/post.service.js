import AuthAxios from './authAxios';


class PostService {
  getNewsFeed = email =>
    AuthAxios.get(`new_newsFeed/${email}`)
  createPost = (uid,data) => 
     AuthAxios.post(`new_post/${uid}`,data,config)
  getPostByEmail = (email,config) =>
    AuthAxios.get(`posts/email/${email}`,config)
  getPostByPostId = pid =>
    AuthAxios.get(`posts/post-by-id/${pid}`)
  getSavedPost = email => 
    AuthAxios.get(`posts/${email}/saved_posts`)
  deletePost = postId =>
    AuthAxios.delete(`posts/${postId}`)
  editPost = postId =>
    AuthAxios.put(`posts/${postId}`)
  getPosts = () => 
    AuthAxios.get(`posts`)
  likePost = (uid, pid,emoji) => AuthAxios.put(`posts/${uid}/like-unlike/${pid}`, {emoji: emoji});
  savePost = (uid, pid) => AuthAxios.put(`posts/${uid}/save-unsave/${pid}`);

  sharePost = (uid,pid,data) => AuthAxios.post(`share/${uid}/${pid}`,data);

  /******************** COMMENT *******************/
  addComment = (userid, postid, comment) => 
    AuthAxios.post(`comment/${userid}/${postid}`,comment)
  deleteComment = commentid => 
    AuthAxios.delete(`comment/delete/${commentid}`)
  replay = (uid,commentId,data) =>
    AuthAxios.post(`comment/reply/${uid}/${commentId}`,data)
  likeUnlikeComment = (uid,cid,params) =>
    AuthAxios.put(`comment/${uid}/like-unlike/${cid}`,params)
  editComment = (cid,comment) => 
    AuthAxios({
      method:'PUT',
      url:`comment/Edit_comment/${cid}`,
      params:{
        content:comment
      }
    })
  

  getAllComments = (uid,pid) =>
    AuthAxios.get(`comment/${uid}/get_comments/${pid}`)
  getAllReply = (cid) => 
    AuthAxios.get(`comment/get_replies/${cid}`)
}
const config = {
  onUploadProgress: progressEvent => {
    progress = (progressEvent.loaded / progressEvent.total) * 50;

  },
  onDownloadProgress: progressEvent => {
    progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;

  },
}
export default new PostService();
