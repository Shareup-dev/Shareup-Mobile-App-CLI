import AuthAxios from './authAxios';
import ChatAxios from './chatAxios';

const setAxiosToken = token => {
  if (token) {
    AuthAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    ChatAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    AuthAxios.defaults.headers.common['Authorization'] = null;
    ChatAxios.defaults.headers.common['Authorization'] = null;
  }
};

export {setAxiosToken};
