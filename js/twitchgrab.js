// This file code specific to grabbing data from Twitch.
// Keith Murphy, 10-2016

function StreamData(gameName, channels) {
  this.GameName = gameName;
  this.Channel = channels;  
}

var streams = [];

$(document).ready(function() {  
  pullTwitchData();
});

function pullTwitchData() {
  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/games/top?limit=100',
    headers: {
      'Client-ID': '15eis5nq1567uq8qqkev5p5s7c0lfes'
    },
    success: function(twitchGamesObject) {
      // Twitch returns a list of games objects (in .top)
      // sorted by number of current viewers on Twitch, 
      // most popular first.
      // km,10.16
    
      var counter = 0;
    
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
            streams.push( new StreamData( eachGame.game.name, twitchStreamsObject.streams));
          }
        });
        counter++;
      });  
    }
  })
}

$('input').keypress(function(e) {
  if( isKeypressANumber(e)) {
    waitingWriteTable();
  } else {
    e.preventDefault(); //stop character from entering input
  }
});

// function waits a half second to run
var waitingWriteTable = _.debounce(writeTable, 1000);

function writeTable() {
  // TODO: look this over closely, this is likely not finished
  
  var viewers = $('input').val()
  var tr;
  var yourRank;
  
  removeTableRows("tablebyviewers");
  
  for(iStream=0; iStream<100; iStream++){
    if(streams[iStream] && streams[iStream].Channel && (streams[iStream].Channel.length > 0 )){
        var foundStreamerRanking = false;   
        for(iChannel=0; !foundStreamerRanking && iChannel<10; iChannel++){
          if(streams[iStream].Channel && streams[iStream].Channel[iChannel] && (streams[iStream].Channel[iChannel].viewers < viewers)){
            yourRank = iChannel + 1;
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
    
        tr.append("<td>" + streams[iStream].GameName + "</td>");
        tr.append("<td>" + yourRank + "</td>");
        tr.append("<td>" + (streams[iStream].Channel.length > 0 ? streams[iStream].Channel[0].viewers : "No Streamer") + "</td>");
        tr.append("<td>" + (streams[iStream].Channel.length > 2 ? streams[iStream].Channel[2].viewers : "No Streamer") + "</td>");
        tr.append("<td>" + (streams[iStream].Channel.length > 4 ? streams[iStream].Channel[4].viewers : "No Streamer") + "</td>");
        tr.append("<td>" + (streams[iStream].Channel.length > 9 ? streams[iStream].Channel[9].viewers : "No Streamer") + "</td>");
        $('.tablebyviewers').append(tr);
        console.log("we reach here.");  
    }
  }
  sortTable("tablebyviewers");  
}