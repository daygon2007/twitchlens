// This file is full of TwitchLens specific
// functions.  Keith Murphy, 10-2016

$('input').keypress(function(e) {
  if( isKeypressANumber(e)) {
	waitingonNewViewerValue();
  } else {
	e.preventDefault(); //stop character from entering input
  }
});

// function waits a half second to run
var waitingonNewViewerValue = _.debounce(onNewViewerValue, 1000);

function onNewViewerValue() {

  removeTableRows("tablebyviewers");
  
  $.ajax({
	type: 'GET',
	url: 'https://api.twitch.tv/kraken/games/top?limit=100',
	headers: {
	  'Client-ID': '15eis5nq1567uq8qqkev5p5s7c0lfes'
	},
	success: function(twitchGamesObject) {
	  // Twitch returns a list of games objects (in .top)
	  // sorted by number of current viewers on Twitch, 
	  // most popular first. -- km,10.16
	  
	  _.each(twitchGamesObject.top, function(eachGame) {
		
		$.ajax({
		  type: 'GET',
		  url: 'https://api.twitch.tv/kraken/streams?game=' + eachGame.game.name,
		  headers: {
			'Client-ID': '15eis5nq1567uq8qqkev5p5s7c0lfes'
		  },
		  success: function(twitchStreamsObject) {
			// Twitch returns a list of stream objects (each 
			// accessible by .streams[i]) sorted by number of 
			// viewers descending. -- km,10.16		
			
			writeTable(twitchStreamsObject, eachGame.game.name);
		  }
		});		  
	  });  
	}
  })
}

// function waits a half second to run
//var waitingwriteTable = _.debounce(writeTable, 1000);

function writeTable(twitchStreamsObject, gameName) {
  var Viewers = $('input').val()
  var tr;
  var yourRank;
  var Rank1;
  var Rank3;
  var Rank5;
  var Rank10;

  if (twitchStreamsObject.streams.length < 1) {
	Rank1 = "No streamer";
  } else {
	Rank1 = twitchStreamsObject.streams[0].viewers;
  }

  if (twitchStreamsObject.streams.length < 3) {
	Rank3 = "No streamer";
  } else {
	Rank3 = twitchStreamsObject.streams[2].viewers;
  }

  if (twitchStreamsObject.streams.length < 5) {
	Rank5 = "No streamer";
  } else {
	Rank5 = twitchStreamsObject.streams[4].viewers;
  }

  if (twitchStreamsObject.streams.length < 10) {
	Rank10 = "No streamer";
  } else {
	Rank10 = twitchStreamsObject.streams[9].viewers;
  }

  var foundStreamerRanking = false;
  
  for (var i = 0; i < twitchStreamsObject.streams.length; i++) {
	if (twitchStreamsObject.streams[i].viewers < Viewers && !foundStreamerRanking) {
	  yourRank = i + 1;
	  foundStreamerRanking = true;
	}
  }

  if (!foundStreamerRanking) {
	yourRank = "Very Low";
  }

  if (yourRank < 5) {
	tr = $('<tr class="success"/>');
  } else if (yourRank < 15 || yourRank < 3) {
	tr = $('<tr/>');
  } else {
	tr = $('<tr class="danger"/>');
  }

  //tr.append("<td>" + decodeURI(jsonfile.replace('/json/', '').replace('.json', '')) + "</td>");
  tr.append("<td>" + gameName + "</td>");
  tr.append("<td>" + yourRank + "</td>");
  tr.append("<td>" + Rank1 + "</td>");
  tr.append("<td>" + Rank3 + "</td>");
  tr.append("<td>" + Rank5 + "</td>");
  tr.append("<td>" + Rank10 + "</td>");
  $('.tablebyviewers').append(tr);
  sortTable("tablebyviewers");
  
}