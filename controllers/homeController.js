const express = require("express");
const router = express.Router();
const request = require("request");

const Library = require("../models/libraryModel.js")
const Player = require("../models/playerModel.js")
const Friends = require("../models/friendsModel.js")

router.get("/", (req, res) => {
	res.render("index", {})
})

// Model builder routes (add if..else for new games when complete)
router.get("/user", function(req, res) { //brackets issue

    //Library Builder

    //Library call
    const libraryURL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+ process.env.API_KEY +"&steamid=76561197960434622&format=json";
    
    request.get(libraryURL, (err, returnedLibrary) => { //brackets issue
        console.log("___________________________________________________")
        console.log(returnedLibrary)
        console.log("___________________________________________________")
 
        const libraryObject = returnedLibrary.body

        //Library Builder

        for (let i=0; i < libraryObject.response.game_count - 1; i++) { 
        
            const gameID = libraryObject.repsonse.games[i].appid
            const gameURL = "https://store.steampowered.com/api/appdetails/?appids=" + gameID

            request.get(gameURL, (err, returnedGame) => { 
                
                console.log("___________________________________________________")
                console.log(returnedGame)
                console.log("___________________________________________________")

                const gameObject = returnedGame.body


                const playerStats = []
                const playerAchievements = []

                //gameObject modifications

                    //Genres
                    const gameGenres = []

                    for (let i = 0; i < gameObject.gameID.data.genres.length - 1; i++){
                        gameGenres.push(gameObject.gameID.data.genres[i].description)
                    }

                    //Multiplayer
                    const gameMultiplayer = false

                    for (let i = 0; i < gameObject.gameID.data.categories.length - 1; i++){
                        if (gameObject.gameID.data.categories[i].id === 1){
                            gameMultiplayer = true
                        }
                    }

                    //Screenshots
                    const gameScreenshots = []

                    for (let i = 0; i < gameObject.gameID.data.screenshots.length -1; i++){
                        gameScreenshots.push(gameObject.gameID.data.screenshots[i].path_thumbnail)
                    }

                //Stats call
                const statsURL = "https://http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key="+ process.env.API_KEY +"&steamids=76561197960434622&format=json";
                
                request.get(statsURL, (err, returnedStats) => {

                    console.log("___________________________________________________")
                    console.log(returnedStats)
                    console.log("___________________________________________________")

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

                    console.log("___________________________________________________")
                    console.log(returnedAchievements)
                    console.log("___________________________________________________")

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
                console.log("___________________________________________________")
                console.log(gameObject.gameID.data.steam_appid)
                console.log(gameObject.gameID.data.name)
                console.log(gameGenres)
                console.log(gameObject.gameID.data.detailed_description)
                console.log(gameObject.gameID.data.about_the_game)
                console.log(gameObject.gameID.data.publishers[0])
                console.log(gameMultiplayer)
                console.log(gameObject.gameID.data.metacrititc.score)
                console.log(gameObject.gameID.data.recommendations.total)
                console.log(playerAchievements)
                console.log(playerStats)
                console.log(gameObject.gameID.data.header_image)
                console.log(gameScreenshots)
                console.log("___________________________________________________")


                Library.create({

                    gameID: gameObject.gameID.data.steam_appid,
                    name: gameObject.gameID.data.name,
                    genres: gameGenres,
                    description: gameObject.gameID.data.detailed_description,
                    about: gameObject.gameID.data.about_the_game,
                    publisher: gameObject.gameID.data.publishers[0],
                    multiplayer: gameMultiplayer,
                    score: gameObject.gameID.data.metacrititc.score,
                    recommendations: gameObject.gameID.data.recommendations.total,
                    achievements: playerAchievements,
                    stats: playerStats,
                    banner: gameObject.gameID.data.header_image,
                    screenshots: gameScreenshots
                })
            })
        }
    })

    //Friends Builder

    //Friends call
    const friendsListURL = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key="+ process.env.API_KEY +"&steamid=76561197960434622&relationship=friend&format=json%22"

    request.get(friendsListURL, (err, returnedFriends) => {

        console.log("___________________________________________________")
        console.log(returnedFriends.body)
        console.log("___________________________________________________")

        setTimeout(() => {

            const friendsListObject = returnedFriends.body

        }, 5000)

        for (let i = 0; i < friendsListObject.friendslist.friends.length - 1; i++){

            let friendObject

            //Friend data
            const friendPLayerURL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+ process.env.API_KEY +"&steamids="+ friendsListObject.friendslist.friends[i].steamid +"&format=json";

            request.get(friendURL, (err, returnedFriend) => {

                friendObject = returnedFriend.body

            })



            //Friend's library
            const friendLibraryURL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+ process.env.API_KEY +"&steamid="+ friendsListObject.friendslist.friends[i].steamid +"&format=json";
            let friendLibrary
            const friendLibaryObject = []

            request.get(friendLibraryURL, (err, returnedLibrary) => {

                friendLibrary = returnedLibrary

                for (i = 0; i < friendLibrary.response.game_count - 1; i++) {

                    const gameID = libraryObject.repsonse.games[i].appid
                    const gameURL = "https://store.steampowered.com/api/appdetails/?appids=" + gameID

                    request.get(gameURL, (err, returnedGame) => {

                        console.log("___________________________________________________")
                        console.log(returnedGame)
                        console.log("___________________________________________________")

                        const gameObject = returnedGame.body

                        console.log(gameObject.gameID.data.name)
                        console.log(gameObject.gameID.data.header_image)


                        friendLibraryObject.push({

                            game: gameObject.gameID.data.name,
                            banner: gameObject.gameID.data.header_image

                        })

                    })
                }
             })

            //Create Friend and add to DB
            console.log("___________________________________________________")
            console.log(friendsListObject.friendslist.friends[i].steamid)
            console.log(friendObject.repsonse.players[0].personaname)
            console.log(friendLibaryObject)
            console.log("___________________________________________________")

            Friends.create({

                steamID: friendsListObject.friendslist.friends[i].steamid,
                avatar: friendObject.repsonse.players[0].personaname,
                library: friendLibaryObject

            })
        }
    })

    //Player Builder

    const playerURL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+ process.env.API_KEY +"&steamids=76561197960434622&format=json"

    request.get(playerURL, (err, returnedPlayer) => {
        console.log(returnedPlayer.body)
        const playerObject = returnedPlayer.body

        //Create friend and add to DB
        Player.create({

            steamID: playerObject.response.players[0].steamid,
            name: playerObject.response.players[0].personaname,
            avatar: playerObject.response.players[0].avatarfull
            //add friends key
        })
    } ) 
    res.send()
});




module.exports = router;