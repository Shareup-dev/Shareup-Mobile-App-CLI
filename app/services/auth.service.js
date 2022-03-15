import axios from 'axios';
import settings from '../config/settings';

const url = settings.apiUrl + '/api/v1';

class AuthService {
  login = (username, password) =>
    axios.post(`${url}/users/authenticate`, {username, password});

  signup = user => axios.post(`${url}/register `, user);

  verifyUser = username => axios.get(`${url}/users/email/${username}`);

  sendOTPForPasswordReset = username =>
    axios.put(`${url}/send_otp/${username}`);

  verifyOTP = (username, otp) =>
    axios({
      method: 'GET',
      url: `${url}/verifyotp/${username}`,
      params: {
        otp,
      },
    });

  resetPassword = (username, newPassword) =>
    axios({
      method: 'PUT',
      url: `${url}/reset_password/${username}`,
      params: {
        password: newPassword,
      },
    });
}

export default new AuthService();
