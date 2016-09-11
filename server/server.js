// load future from fibers
var Future = Meteor.npmRequire("fibers/future");

// load ytdl-core
var ytdl = Meteor.npmRequire('ytdl-core');

// load fluent-ffmpeg to convert video to audio
var ffmpeg = Meteor.npmRequire('fluent-ffmpeg');

// load Node.js filesystem module
var fs = Meteor.npmRequire('fs');

YoutubeApi.authenticate({
    type: 'key',
    key: 'AIzaSyAbC62ic8VUaZXpR0fujRDy1CqbWY4YfwI'
});

console.log("Authenticated with youtube for searching!");

Meteor.methods({
  // Get info from Youtube video
	'getVideoInfo':function(videoUrl) {
		this.unblock();
		var future = new Future();

		ytdl.getInfo(videoUrl, function(err, result) {

			var videoFileName = "/home/bitnami/htdocs/video/".concat(result.video_id.concat('.mp4'));
			console.log(videoFileName);

			var stream = fs.createWriteStream(videoFileName);

			ytdl.downloadFromInfo(result, { filter: function(format) { return format.container === 'mp4'; } }).pipe(stream);

			future.return(result)
		});

		return future.wait();
	},
	'convertVideo':function(videoFileName, musicFileName, artist, title) {

		this.unblock();
		var future = new Future();

		var stream = fs.createWriteStream(musicFileName);

		converter = new ffmpeg({source:videoFileName});
      	converter.setFfmpegPath('/usr/bin/ffmpeg');
      	converter.format('mp3');
      	converter.withAudioCodec('libmp3lame').toFormat('mp3');
      	converter.on('error', function(err) {
        	console.log('An error occurred: ' + err.message);
    	});
    	converter.on('end', function() {
        	console.log('Processing finished !');
        	future.return(true);
    	})

      	converter.writeToStream(stream, { end: true });

      	return future.wait();

	},
	'insertMusic':function(music_details){

		music.insert(music_details);
		console.log(music_details);
		return true;

	},
	'searchMusic': function(search) {

		this.unblock();
		var future = new Future();

		console.log("Started a search!");

    YoutubeApi.search.list({
        part: "id, snippet",
        type: "video",
        maxResults: 20,
        q: search,
    }, function (err, data) {
    	if(err){
    		console.log(err);
    	}
    	else{
    		console.log('Did a search! Results:');
    		console.log(data);
    		future.return(data);
    	}
    });

    return future.wait()
  },
  'incrementPlayCount': function(musicId) {
    music.update({_id: musicId}, { $inc: {plays: 1}});
    return true;
  },
  'createPlaylist': function(playlistObject, first_track){
    
    var new_playlist_id = playlists.insert(playlistObject);

    console.log('Playlist ' + playlistObject.name + ' created.');

    first_track.playlist = new_playlist_id;

    first_track.trackId = first_track._id;

    delete first_track._id;

    playlistTracks.insert(first_track);

    console.log('First track information: \n' + first_track);

    return true;

  },
  'addToPlaylist': function(playlist_id, track){

    var destinyPlaylist = playlists.find({_id: playlist_id});

    if(destinyPlaylist != null){
      track.playlist = playlist_id;
      if(track.trackId == null){
        // Track comes from main music collection... assingments must be done...
        track.trackId = track._id;

      }
      else{
        // No assignments need to be done, track is already coming from a playlist!
        console.log("Adding track to playlist provenient from the playlistTracks collection.");
      }
      
      delete track._id;

      console.log("Track Id: " + track.trackId);

      if(playlistTracks.find({trackId: track.trackId, playlist: playlist_id}).count() == 0){
        playlistTracks.insert(track);
        return true;
      }
      else{
        console.log("Track is already in the playlist");
      }
    }
    else{
      console.log("Unable to insert track into playlist due to invalid ID provided.");
      return false;
    }

  }
});