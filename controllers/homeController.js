const express = require("express");
const router = express.Router();
const request = require("request");

router.get("/", (req, res) => {
	res.render("index", {})
})

// router.get("/steam/civ5achievements", (req, res) => {
	
// })



router.get('/steam', function(req, res) {
	// ?appid=440&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // Calculate the Steam API URL we want to use
    var url = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+ process.env.API_KEY +'&steamid=76561197960434622&format=json';
    request.get(url, function(error, steamHttpResponse) {
        // Once we get the body of the steamHttpResponse, send it to our client
        // as our own httpResponse
        console.log(steamHttpResponse)
        // httpResponse.setHeader('Content-Type', 'application/json');
        // httpResponse.send(steamHttpBody);
        res.send(steamHttpResponse.body)
    });

    
});

module.exports = router;