import AuthAxios from './authAxios';

class PostService {
  getNewsFeed = email =>
    AuthAxios.get(`/newsFeed/${email}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}
export default new PostService();
