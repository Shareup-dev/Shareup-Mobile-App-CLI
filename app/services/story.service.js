import AuthAxios from './authAxios';

class Story {
  addStory = (userId, storyData) =>
    AuthAxios.post(`/Stories/${userId}`, storyData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

  getStories = () =>
    AuthAxios.get(`/stories`)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}
export default new Story();
