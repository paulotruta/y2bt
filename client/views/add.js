Template.add.helpers({
	'musicTitle': function(separated = false){
			
		var complete_title = Session.get('musicTitle_tmp');

		if(separated){

			var separated_title = [Session.get('musicTitle_artist_tmp'), Session.get('musicTitle_title_tmp')];

			console.log(separated_title);

			return separated_title;

		}
		else{
			return complete_title;
		}
	},
	'inputTitle': function(){
		return Session.get('musicTitle_title_tmp');
	},
	'inputArtist': function(){
		return Session.get('musicTitle_artist_tmp');
	},
	'loadingMusic': function(){
		return Session.get('loadingMusic');
	},
	'addingMusic': function(){
		return Session.get('addingMusic');
	},
	'youtubePlayerHelper': function(){
		// YouTube API will call onYouTubeIframeAPIReady() when API ready.
    	// Make sure it's a global variable.
    	onYouTubeIframeAPIReady = function () {

        	// New Video Player, the first argument is the id of the div.
        	// Make sure it's a global variable.
        	player = new YT.Player("youtubePlayer", {

            	height: "134", 
            	width: "200", 

            	// videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
            	videoId: Session.get('videoObject_tmp').video_id, 

            	// Events like ready, state change, 
            	events: {

                	onReady: function (event) {
                		// Stop the player if anything was playing at the time...
                		$('#musicPlayer').trigger('pause');
                		Session.set('isPlaying', false);
                    	// Play video when player ready.
                    	event.target.playVideo();
                	}

            	}

        	});
    	};

    	YT.load();
	}
});

Template.add.events({
	'click .applink-getMusic': function(){

		Session.set('loadingMusic', true);
		Session.set('addingMusic', true);

		var videoUrl = $('#youtubeurl').val();

		Meteor.call('getVideoInfo', videoUrl, function(err, result) {

			var videoFileName = "/home/bitnami/htdocs/video/".concat(result.video_id).concat(".mp4");
			var musicFileName = "/home/bitnami/htdocs/music/".concat(result.video_id).concat(".mp3");
			
			Session.set('musicTitle_tmp', result.title);
  			Session.set('musicUrl_tmp', "http://bitnami-meanstack-2dab.cloudapp.net".concat("/music/".concat(result.video_id).concat(".mp3")));
  			Session.set('musicLocation', musicFileName);
  			Session.set('videoLocation', videoFileName);
  			Session.set('musicThumbnail_tmp', result.thumbnail_url);
  			Session.set('videoObject_tmp', result);

  			var title = "";
			var artist = "";
			var artistFilled = false;

			var title_split = result.title.split('-');
			
			console.log(title_split);

			var index, len;
			for (index = 0, len = title_split.length; index < len; ++index) {
    			
    			//console.log(title_split[index]);
    			element = title_split[index];
				element = element.trim();
				console.log(element);

				if(!artistFilled){

					if(isNaN(element)) {
						
						artist = element;
						artistFilled = true;

					}
				}
				else{
					title += " ".concat(element);
					console.log(title);
				}
			}

			Session.set('musicTitle_artist_tmp', artist);
			Session.set('musicTitle_title_tmp', title);

  			console.log(result);
  			console.log(err);

  			//console.log (result.thumbnail_url);
  			Session.set('loadingMusic', false);

		});

	},
	'click .applink-addMusic': function(){

		Session.set('loadingMusic', true);

		var videoFileName = Session.get('videoLocation');
		var musicFileName = Session.get('musicLocation');

		var artist = $('#newMusicArtist').val();
		var title = $('#newMusicTitle').val();

		Meteor.call('convertVideo', videoFileName, musicFileName, artist, title, function(err, result){

			

			Session.set('musicUrl', Session.get('musicUrl_tmp'));
			Session.set('musicTitle', Session.get('musicTitle_tmp'));
			Session.set('playerTitle', Session.get('musicTitle_tmp'));
			Session.set('musicThumbnail', Session.get('musicThumbnail_tmp'));
			Session.set('playerThumbnail', Session.get('musicThumbnail_tmp'));
			Session.set('addingMusic', false);
			Session.set('loadingMusic', false);

			console.log("Video Converted and saved.");

			Session.set('isPlaying', true);
			Session.set('hidePlayer', false);

			var video_object = Session.get('videoObject_tmp');

			var music_info = {
				"userId": Meteor.userId(),
				"createdAt": new Date(),
				"plays": 0,
				"videoId": video_object.video_id,
				"thumbnail": video_object.thumbnail_url,
				"avg_rating": video_object.avg_rating,
				"title": title,
				"artist": artist,
				"length": video_object.length_seconds,
				"location": Session.get('musicUrl_tmp')
			};

			//console.log(music_info);

			Meteor.call('insertMusic', music_info);
			//Session.set('musicUrl', musicFileName);

			$('#musicPlayer').trigger('stop');

			$('#musicPlayerWrapper').html('<audio src="'+Session.get('musicUrl_tmp')+'" preload="auto" autoplay="autoplay" class="musicPlayer" id="musicPlayer" controls></audio>');
			
			$('#musicPlayer').trigger('play');

		});

	},
	'click .applink-cancelAdd': function(){

		Session.set('loadingMusic', false);
		Session.set('addingMusic', false);

	}
});

Template.add.rendered = function () {
	Session.set('musicTitle', null);
	Session.set('loadingMusic', false);
	Session.set('addingMusic', false);
};

