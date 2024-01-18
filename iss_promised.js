const request = require('request-promise-native');

// Returns request of IP data.
const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

// Request Geo Locations using IP
const fetchCoordsByIP = (ipBody) => {
  // Parse JSON to get IP
  const ip = JSON.parse(ipBody).ip;
  return request(`http://ipwho.is/${ip}`);
};

//Fetch fly over times.
const fetchISSFlyOverTimes = (locBody) => {
  const parsedBod = JSON.parse(locBody);
  const lat = parsedBod.latitude;
  const long = parsedBod.longitude;

  return request(`https://iss-flyover.herokuapp.com/json/?lat=${lat}&lon=${long}`);
};
// Main function to export
const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const response = JSON.parse(data).response;
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };