const express = require("express");
const router = express.Router();
const request = require("request");

router.get("/", (req, res) => {
	res.render("index", {})
})

// router.get("/steam/civ5achievements", (req, res) => {
	
// })



router.get("/steam", function(req, res) {

    const libURL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+ process.env.API_KEY +"&steamid=76561197960434622&format=json";
    request.get(libURL, (err, returnedLibrary) => {

        console.log(returnedLibrary)
 
        const library = returnedLibrary.body
        

        const statsURL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+ process.env.API_KEY +"&steamids=76561197960434622&format=json";
	    		
    		request.get(playerURL, (err, returnedStats) => {

    			const stats = returnedStats.body
    			
    			for (let i=0; i < library.response.game_count - 1; i++) {
    	
        			const gameID = library.repsonse.games[i].appid
        			const gameURL = "http://store.steampowered.com/api/appdetails/?appids=" + gameID
        	
        			request.get(gameURL, (err, returnedGame) => {


    				})
    			}

    		})

        res.send(returnedLibrary.body)

    });

});




module.exports = router;