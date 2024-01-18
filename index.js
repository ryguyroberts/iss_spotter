const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work at the IP fetch stage!" , error);
    return;
  }
  // The nesting nightmare begins callback into fetchCoords
  fetchCoordsByIP(ip, (error, data) => {
    if (error) {
      console.log("It didn't work at the FetchCo-ords stage", error);
    }
    console.log('Should be geo data', data);
    // The nest continues callback into FetchISS
    fetchISSFlyOverTimes(data, (error, data) => {
      if (error) {
        console.log("It didn't work at the fetch ISS location stage", error);
      }
      // Retuns the .request data from ISS
      console.log(data);
    });
  });
});

