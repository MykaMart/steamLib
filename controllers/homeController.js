const express = require("express");
const router = express.Router();
const request = require("request");

const Library = require("../models/libraryModel.js")
const Player = require("../models/playerModel.js")
const Freinds = require("../models/friendsModel.js")

router.get("/", (req, res) => {
	res.render("index", {})
})

// Model builder routes (add if..else for new games when complete)
router.get("/user", function(req, res) { //brackets issue

    //Library Builder

    //Library call
    const libraryURL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+ process.env.API_KEY +"&steamid=76561197960434622&format=json";
    
    request.get(libraryURL, (err, returnedLibrary) => { //brackets issue

        console.log(returnedLibrary)
 
        const libraryObject = returnedLibrary.body

        //Library Builder
        for (let i=0; i < libraryObject.response.game_count - 1; i++) { 
        
            const gameID = libraryObject.repsonse.games[i].appid
            const gameURL = "https://store.steampowered.com/api/appdetails/?appids=" + gameID

            request.get(gameURL, (err, returnedGame) => { 

                const gameObject = returnedGame.body


                const playerStats = []
                const playerAchievements = []

                //gameObject modifications

                    //Genres
                    const gameGenres = []

                    for (let i = 0; i < gameObject.300.data.genres.length - 1; i++){
                        gameGenres.push(gameObject.300.data.genres[i].description)
                    }

                    //Multiplayer
                    const gameMultiplayer = false

                    for (let i = 0; i < gameObject.300.data.categories.length - 1; i++){
                        if (gameObject.300.data.categories[i].id === 1){
                            gameMultiplayer = true
                        }
                    }

                    //Screenshots
                    const gameScreenshots = []

                    for (let i = 0 < gameObject.300.data.screenshots.length -1; i++){
                        gameScreenshots.push(gameObject.300.data.screenshots[i].path_thumbnail)
                    }

                //Stats call
                const statsURL = "https://http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key="+ process.env.API_KEY +"&steamids=76561197960434622&format=json";
                
                request.get(statsURL, (err, returnedStats) => {

                    const statsObject = returnedStats.body

                    for (let i = 0; i < statsObject.playerstats.stats.length - 1; i++){
                        playerStats.push({

                            stat: statsObject.playerststats.stats[i].name,
                            value: statsObject.playerstats.stats[i].value

                        })
                    }
                })

                //Achievements call
                const achievementsURL = "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=440&key="+ process.env.API_KEY +"&steamid=76561197960434622&format=json"

                request.get(achievementsURL, (err, returnedAchievements) => {

                    const acheivementsObject = returnedAchievements.body

                    for (let i = 0; i < acheivementsObject.playerststats.achievements - 1; i++) {

                        if (acheivementsObject.playerststats.achievements[i].achieved === 1){
                            acheivementsObject.playerststats.achievements[i].achieved = true
                        }

                        playerAchievements.push({

                            achievement: acheivementsObject.playerststats.achievements[i].apiname,
                            achieved: acheivementsObject.playerststats.achievements[i].achieved
                        })
                    }
                })

                //Create Game and add to DB

                Library.create({

                    gameID: gameObject.300.data.steam_appid,
                    name: gameObject.300.data.name,
                    genres: gameGenres,
                    description: gameObject.300.data.detailed_description,
                    about: gameObject.300.data.about_the_game,
                    publisher: gameObject.300.data.publishers[0],
                    multiplayer: gameMultiplayer,
                    score: gameObject.300.data.metacrititc.score,
                    recommendations: gameObject.300.data.recommendations.total,
                    achievements: [playerAchievements],
                    stats: [playerStats],
                    banner: gameObject.300.data.header_image,
                    screenshots: gameScreenshots
                })
            })
        }
    })

    //Friends Builder

    //Friends call
    const friendsListURL = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key="+ process.env.API_KEY +"&steamid=76561197960434622&relationship=friend&format=json"

    request.get(friendsListURL, (err, returnedFriends) => {

        const friendsListObject = returnedFriends.body

        for (let i = 0; i < friendsListObject.friendslist.friends.length - 1; i++){

            let friendObject

            //Friend data
            const friendPLayerURL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+ process.env.API_KEY +"&steamids="+ friendsListObject.friendslist.friends[i].steamid +"&format=json";

            request.get(friendURL, returnedFriend) => {

                friendObject = returnedFriend.body

            }



            //Friend's library
            const friendLibraryURL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+ process.env.API_KEY +"&steamid="+ friendsListObject.friendslist.friends[i].steamid +"&format=json";
            let friendLibrary
            const friendLibaryObject = []

            request.get(friendLibraryURL, returnedLibrary) => {

                friendLibrary = returnedLibrary

                for (i = 0; i < friendLibrary.response.game_count - 1; i++) {

                    const gameID = libraryObject.repsonse.games[i].appid
                    const gameURL = "https://store.steampowered.com/api/appdetails/?appids=" + gameID

                    request.get(gameURL, (err, returnedGame) => {

                        const gameObject = returnedGame.body

                        friendLibraryObject.push({

                            game: gameObject.300.data.name,
                            banner: gameObject.300.data.header_image

                        })

                    })
                }
             }

            //Create Friend and add to DB

            Friends.create({

                steamID: friendsListObject.friendslist.friends[i].steamid,
                avatar: friendObject.repsonse.players[0].personaname,
                library: friendLibaryObject

            })
        }
    })

    //Player Builder

    const playerURL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+ process.env.API_KEY +"&steamids=76561197960434622&format=json"

    request.get(playerURL, returnedPlayer) => {
        const playerObject = returnedPlayer.body

        //Create friend and add to DB
        Player.create({

            steamID: playerObject.repsonse.players[0].steamid,
            name: playerObject.repsonse.players[0].personaname,
            avatar: playerObject.repsonse.players[0].avatarfull
            //add friends key
        })
    }  
    res.send()
});




module.exports = router;