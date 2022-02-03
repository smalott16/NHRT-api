const axios = require('axios');
const _ = require('lodash');

//note the env canada weather api did not return realtime data within the last 30 days. They are slow to publish 
//the realtime data it seems. I have opted for the download csv route. This seems to work for the time being. 

/**
 * @param {string} stationID Water service of canada station id number 
 */
const downloadRealtimeHindcast = (stationID) => {

  return axios.get(`https://dd.weather.gc.ca/hydrometric/csv/BC/hourly/BC_${stationID}_hourly_hydrometric.csv`)
    .then((response) => {
      
      //so far most of the data has been 5 minute interval despite being called hourly
      //I expect some data may actually be hourly this
      const rawStreamflowData = response.data.split('\n').slice(1, -1);

      //check the time interval using the first two time readings
      timeIntervalMins = findTimeInterval(rawStreamflowData.slice(0, 2));
      console.log(`Hindcast detected at a ${timeIntervalMins} minute interval`)

      if (timeIntervalMins > 60) {
        throw new Error("time interval is greater than 60 minutes, averaging will not work")
      }

      let streamflowHindcastData = calculateHourlyAverage(rawStreamflowData);
      
      return streamflowHindcastData;
    
    })
    .catch((error) => {
      console.log(error.message)
    });
}

const calculateHourlyAverage = (rawStreamflowData) => {
  let streamflowData = {}
  
  //build data object that includes all data
  rawStreamflowData.forEach((recordString) => {  
    //parse out the important information from each record string
    let recordArray = recordString.split(',');
    let streamflow = Number(recordArray[6]);
    let date = recordArray[1].split('T');
    let day = date[0];
    let hour = date[1].split(':')[0];

    // if the day exists but the hour doesn't yet exist, set the hour value for streamflow as an array
    if (streamflowData[day] && !streamflowData[day][hour]) {
      streamflowData[day][hour] = [streamflow];
    
    // if the day exists and the hour exists set the value for streamflow add to the streamflow array
    } else if (streamflowData[day] && streamflowData[day][hour]) {
      currentValues = streamflowData[day][hour];
      streamflowData[day][hour] = [...currentValues, streamflow];
    
    //if the day doesn not exist then set the day value equal to an object containing the hour and
    //streamflow array  
    } else {
      streamflowData[day] = {[hour]: [streamflow]};
    
    }   
  });

  //now loop through again and average the data - REFACTOR THIS
  let avgStreamflowData = {};
  for (let day in streamflowData) {
    for (let hour in streamflowData[day]) {
      if (avgStreamflowData[day]) {
        avgStreamflowData[day][hour] = _.mean(streamflowData[day][hour]);
      } else {
        avgStreamflowData[day] = {[hour]: _.mean(streamflowData[day][hour])};
      }
    }
  }

  return avgStreamflowData;
}

/**
 * Function used to determine what the time interval of the downloaded dataset is
 * Very specifc as it relates to the format of the downloaded data
 * @param {array} timeArray  
 * @returns a number in minutes based on the difference between the two time readings
 */
const findTimeInterval = (timeArray) => {
  //return the time interval in minutes
  
  const interval = timeArray.map((timeRecord) => {
    //parse through the time record to access the actual time interval data
    let parsedTime = timeRecord.split(',')[1].split('T')[1].split(':');
    return Number(parsedTime[0]) * 60 + Number(parsedTime[1]);
  })
  
  return interval[1] + interval[0];
}

module.exports = downloadRealtimeHindcast;