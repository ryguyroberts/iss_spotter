const { nextISSTimesForMyLocation } = require('./iss_promised');

// To format each pass time. 
const printPass = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTime) => {
    printPass(passTime);
  })
  .catch((error) => {
  console.log("It didn't work =(", error.message);
  });