require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser     = require('body-parser');
const https = require("https");

const homeController  = require('./controllers/homeController')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://api.steampowered.com');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', false);

//   // Pass to next layer of middleware
//   next();
// });

// app.get('/steam/civ5achievements', function(httpRequest, httpResponse) {
//     // Calculate the Steam API URL we want to use
//     var url = 'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/' +
//         'v2/?key=YF45B8E320A2BED0BF9730245EA191005&appid=8930';
//     request.get(url, function(error, steamHttpResponse, steamHttpBody) {
//         // Once we get the body of the steamHttpResponse, send it to our client
//         // as our own httpResponse
//         httpResponse.setHeader('Content-Type', 'application/json');
//         httpResponse.send(steamHttpBody);
//     });
// });

app.use(express.static('public'))


app.use('/home', homeController);

app.listen(3000, () => {
  console.log('listening')
})
// https.createServer(app).listen(3000)