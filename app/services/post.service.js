import React, {useState} from 'react';
import axios, { Axios } from 'axios';
import AuthAxios from './authAxios';


class PostService {
  getNewsFeed = email =>
    AuthAxios.get(`newsFeed/${email}`)

  createPost = (uid,data) => 
     AuthAxios.post(`posts/${uid}`,data,config)
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

  /******************** COMMENT *******************/
  addComment = (userid, postid, comment) => 
    AuthAxios.post(`comment/${userid}/${postid}`,comment)
  deleteComment = commentid => 
    AuthAxios.delete(`comment/${commentid}`)
  replay = (uid,commentId,data) =>
    AuthAxios.post(`reply/${uid}/${commentId}`,data)
  likeUnlikeComment = (uid,cid) =>
    AuthAxios.put(`comment/${uid}/like-unlike/${cid}`)
  editComment = (cid) => 
    AuthAxios.put(`comment/Edit_comment/${cid}`)
}
const config = {
  onUploadProgress: progressEvent => {
    progress = (progressEvent.loaded / progressEvent.total) * 50;
    console.log(progressEvent.loaded)
  },
  onDownloadProgress: progressEvent => {
    progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
    console.log(progress);
  },
}
export default new PostService();
