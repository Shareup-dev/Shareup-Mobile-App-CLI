import {UnAuthAxios} from './authAxios';

class AuthService {
  login = (username, password) =>
    UnAuthAxios({
      method: 'POST',
      url: 'users/authenticate',
      data: {username, password},
    });

  signup = user =>
    UnAuthAxios({
      method: 'POST',
      url: 'register',
      data: user,
    });

  verifyUser = username =>
    UnAuthAxios({
      method: 'GET',
      url: `users/email/${username}`,
    });

  passwordResetOTP = username =>
    UnAuthAxios({
      method: 'PUT',
      url: `send_otp/${username}`,
    });

  verifyPasswordResetOTP = (username, otp) =>
    UnAuthAxios({
      method: 'GET',
      url: `verify_otp_reset_password/${username}`,
      params: {
        otp,
      },
    });

  verifyEmailOTP = username =>
    UnAuthAxios({
      method: 'PUT',
      url: `send_otp_verify_email/${username}`,
    });
  verifyEmailConfirmOTP = (username, otp) =>
    UnAuthAxios({
      method: 'GET',
      url: `verify_otp_email_verify/${username}`,
      params: {
        otp,
      },
    });

  resetPassword = (username, newPassword) =>
    UnAuthAxios({
      method: 'PUT',
      url: `reset_password/${username}`,
      params: {
        password: newPassword,
      },
    });
}

export default new AuthService();
