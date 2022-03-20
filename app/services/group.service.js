import AuthAxios from './authAxios';
class Group {
  createGroup = (uid, data) => AuthAxios.post(`/${uid}/create`, data);
}
export default new Group();
