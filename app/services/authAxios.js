import axios from 'axios';
import settings from '../config/settings';

const baseURL = `${settings.apiUrl}/api/v1/`;

const AuthAxios = axios.create({
  baseURL: baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    Origin: 'https://cors-everywhere.herokuapp.com',
  },
});
const UnAuthAxios = axios.create({
  baseURL: baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',

    Origin: 'https://cors-everywhere.herokuapp.com',
  },
});

export {UnAuthAxios};
export default AuthAxios;
