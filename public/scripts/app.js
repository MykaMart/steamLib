// for (let i = 0; i < moviesCSV.length; i++) {
// 		let query = `?t=${moviesCSV[i].Title.replace(/ /g, "+")}&y=${moviesCSV[i].Year}&apikey=d2f48936`;

		$.ajax({
			      url: " http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F45B8E320A2BED0BF9730245EA191005&steamid=76561197960434622&format=json"
			      dataType: "JSON",
			      type: "GET",
			      success: (res) => {
			        console.log(res)
			      error: (err) => {
			        console.log(err)
			      }
			})