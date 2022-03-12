import {createContext} from 'react';

const authContext = createContext({
  user: null,
  setUser: user => {
    console.log('storinguser in userCtx: ', user);
  },
});

export default authContext;
