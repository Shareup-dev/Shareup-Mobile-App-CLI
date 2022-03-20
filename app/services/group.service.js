import AuthAxios from './authAxios';
class Group {
  createGroup = (oid, data) => AuthAxios.post(`/groups/${oid}`, data);
}
export default new Group();
