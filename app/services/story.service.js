import AuthAxios from './authAxios';

class Story {
  addStory = (userId, storyData) =>
    AuthAxios.post(`/Stories/${userId}`, storyData)
      .then(res => res)
      .catch(e => {
        throw e;
      });

  getStories = () =>
    AuthAxios.get(`/stories`)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}
export default new Story();
