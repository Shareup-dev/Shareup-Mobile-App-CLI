import AuthAxios from './authAxios';

class Story {
  addStory = (userId, data) => AuthAxios.post(`/stories/${userId}`, data);
  getStories = () => AuthAxios.get(`/stories`);
}
export default new Story();
