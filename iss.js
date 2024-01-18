const request = require('request');

const fetchMyIP = (callback) => {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // No error but not success status code
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }
    // No errors
    const IP = JSON.parse(body).ip;
    return callback(error, IP);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    const parsedBod = JSON.parse(body);
    // No error but not success status code
    if (!parsedBod.success) {
      const message = `Success status was ${parsedBod.success}. Server message says: ${parsedBod.message} when fetching for IP ${parsedBod.ip}`;
      callback(Error(message), null);
    }
    // No errors
    const geoDudeObj = {
      latitude: parsedBod.latitude,
      longitude: parsedBod.longitude
    };
    return callback(error, geoDudeObj);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const lat = Math.floor(coords.latitude);
  const long = Math.floor(coords.longitude);
  request(`https://iss-flyover.herokuapp.com/json/?lat=${lat}&lon=${long}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    const parsedBod = JSON.parse(body);
    // No error but not success status code
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    // No errors
    return callback(error, parsedBod.response);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    // The nesting nightmare begins callback into fetchCoords
    fetchCoordsByIP(ip, (error, geoLoc) => {
      if (error) {
        return callback(error, null);
      }
      // The nest continues callback into FetchISS
      fetchISSFlyOverTimes(geoLoc, (error, nextPass) => {
        if (error) {
          return callback(error, null);
        }
        // Retuns the .request data from ISS
        callback(error, nextPass);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
