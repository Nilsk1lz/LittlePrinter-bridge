var wifi = require('node-wifi');

module.exports = {
  init: () => {
    wifi.init({
      iface: null, // network interface, choose a random wifi interface if set to null
    });
  },
  scan: () => {
    return Promise((resolve, reject) => {
      wifi.scan((error, networks) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(networks);
          resolve(networks);
        }
      });
    });
  },
};
