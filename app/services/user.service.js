import AuthAxios from './authAxios';

class UserService {
  getUserByEmail = email =>
    AuthAxios.get(`/users/email/${email}`)
}

export default new UserService();
