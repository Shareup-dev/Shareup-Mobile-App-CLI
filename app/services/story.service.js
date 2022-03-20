import AuthAxios from './authAxios';

class Story {
  addStory = (userId, data) => AuthAxios.post(`/Stories/${userId}`, data);
  getStories = () => AuthAxios.get(`/stories`);
}
export default new Story();
