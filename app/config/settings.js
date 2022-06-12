// http://167.71.237.231:8081
// http://195.110.59.203:8081
// http://192.168.100.239:8080
// http://backend.shareup.digital

const settings = {
  dev: {
    apiUrl: 'http://192.168.100.239:8080', //Logeeshan
    //  apiUrl: 'http://192.168.100.238:8080', //This ac
    //apiUrl: 'http://192.168.100.244:8080', //Basma
    //apiUrl: 'http://192.168.100.88:8080', //Rouf
  },
  staging: {
    apiUrl: 'http://192.168.100.2:8080',
  },
  prod: {
    apiUrl: 'http://44.195.204.128',
  },
  secureProd: {
    apiUrl: 'https://api.shareup.qa',
  },
};

const getCurrentSettings = () => {
  //return settings.secureProd;

  return settings.secureProd;
};

export default getCurrentSettings();
