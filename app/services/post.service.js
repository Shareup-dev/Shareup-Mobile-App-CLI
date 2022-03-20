import axios, { Axios } from 'axios';
import AuthAxios from './authAxios';

class PostService {
  getNewsFeed = email =>
    AuthAxios.get(`/newsFeed/${email}`)
  getPostById = postId =>
    AuthAxios.get(`posts/post-by-id/${postId}`)
  deletePost = postId =>
    AuthAxios.delete(`posts/${postId}`)
  editPost = postId =>
    AuthAxios.put(`posts/${postId}`)
  likePost = (uid, pid) => 
    AuthAxios.put(`/posts/${uid}/like-unlike/${pid}`)
  addComment = (userid, postid, comment) => 
    AuthAxios.post(`comment/${userid}/${postid}`,comment)
  deleteComment = commentid => 
    AuthAxios.delete(`comment/${commentid}`)
  


}
export default new PostService();
