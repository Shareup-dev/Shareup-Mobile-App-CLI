import axios from 'axios';
import settings from '../config/settings';

const url = settings.apiUrl;

class AuthService {
  login = (username, password) =>
    axios
      .post(`${url}/api/v1/users/authenticate`, {username, password})
      .then(res => res)
      .catch(e => {
        throw e;
      });
  signup = user =>
    axios
      .post(`${url}/api/v1/users/`, user)
      .then(res => res)
      .catch(e => {
        throw e;
      });
}

export default new AuthService();
