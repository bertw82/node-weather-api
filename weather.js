const https = require('https');
const querystring = require('querystring');
const api = require('./api.json');

// Print out temp details
function printWeather(weather) {
  const message = `Current temperature in ${weather.name} is ${weather.main.temp}F`;
  console.log(message);
}
// Print out error message
function printError(error) {
  console.error(error.message);
}

function get(query) {
    const parameters = {
      APPID: api.key,
      units: 'imperial'
    };

    const zipCode = parseInt(query);
    if (!isNaN(zipCode)) {
      parameters.zip = zipCode + ',us';
    } else {
      parameters.q = query + ',us';
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?${querystring.stringify(parameters)}`;
    try {
        const request = https.get(url, response => {
            if (response.statusCode === 200) { 
                let body = "";
                // Read the data
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    try {
                        //Parse data
                        const weatherData = JSON.parse(body);
                        //Print the data
                        printWeather(weatherData);  
                    } catch (error) {
                        printError(error);             
                    }
                });
            } else {
                const statusCodeError = new Error(`There was an error: (${http.STATUS_CODES[response.statusCode]})`);
                printError(statusCodeError);
            }
        });
        request.on('error', printError);
    } catch (error) {
        printError(error);
    }
}

module.exports.get = get;

//TODO: Handle any errors