import axios, { Axios } from 'axios';
import AuthAxios from './authAxios';

class PostService {
  getNewsFeed = email =>
    AuthAxios.get(`newsFeed/${email}`)
  createPost = (uid,data) =>
    AuthAxios.post(`posts/${uid}`,data)
  getPostById = postId =>
    AuthAxios.get(`posts/user/${postId}`)
  getPostByEmail = email =>
    AuthAxios.get(`posts/email/${email}`)
  getPostByPostId = pid =>
    AuthAxios.get(`posts/post-by-id/${pid}`)
  getSavedPost = email => 
    AuthAxios.get(`posts/${email}/saved_posts`)
  deletePost = postId =>
    AuthAxios.delete(`posts/${postId}`)
  editPost = postId =>
    AuthAxios.put(`posts/${postId}`)
  likePost = (uid, pid) => 
    AuthAxios.put(`posts/${uid}/like-unlike/${pid}`)
  getPosts = () => 
    AuthAxios.get(`posts`)
  addComment = (userid, postid, comment) => 
    AuthAxios.post(`comment/${userid}/${postid}`,comment)
  deleteComment = commentid => 
    AuthAxios.delete(`comment/${commentid}`)
  replay = (uid,commentId,data) =>
    AuthAxios.post(`reply/${uid}/${commentId}`,data)
  

}
export default new PostService();
