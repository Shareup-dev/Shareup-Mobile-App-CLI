import axios, { Axios } from 'axios';
import AuthAxios from './authAxios';

class PostService {
  getNewsFeed = email =>
    AuthAxios.get(`/newsFeed/${email}`)
  deletePost = postId =>
    AuthAxios.delete(`posts/${postId}`)
  editPost = postId =>
    AuthAxios.put(`posts/${postId}`)
      

}
export default new PostService();
