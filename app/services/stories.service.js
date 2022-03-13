import AuthAxios from './authAxios';

class Stories {
  getStories = () =>
    AuthAxios.get(`/stories`)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}
export default new Stories();
