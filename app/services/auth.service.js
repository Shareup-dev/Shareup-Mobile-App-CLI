import axios from 'axios';
import settings from '../config/settings';

const url = `${settings.apiUrl}/api/v1/users/authenticate`;

class AuthService {
  login = (username, password) =>
    axios
      .post(url, {username, password})
      .then(res => res)
      .catch(e => {
        throw e;
      });
}

export default new AuthService();
