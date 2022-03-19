import AuthAxios from './authAxios';

class Story {
  addStory = (userId, data) =>
    AuthAxios({
      method: 'POST',
      url: `/Stories/${userId}`,
      data,
    });

  getStories = () =>
    AuthAxios.get(`/stories`)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}
export default new Story();
