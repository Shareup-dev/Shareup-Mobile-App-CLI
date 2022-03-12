import AuthAxios from './authAxios';

class UserService {
  getUserByEmail = email =>
    AuthAxios.get(`/users/email/${email}`)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}

export default new UserService();
