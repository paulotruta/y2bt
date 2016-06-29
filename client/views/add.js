Template.add.helpers({
	'musicTitle': function(){
		return Session.get('musicTitle_tmp');
	},
	'loadingMusic': function(){
		return Session.get('loadingMusic');
	},
	'addingMusic': function(){
		return Session.get('addingMusic');
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

		Meteor.call('convertVideo', videoFileName, musicFileName, function(err, result){

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

			var player = document.getElementsByTagName("audio")[0];

			var video_object = Session.get('videoObject_tmp');
			var title = "";
			var artist = "";
			var artistFilled = false;

			var title_split = video_object.title.split('-');
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

			var music_info = {
				"userId": Meteor.userId(),
				"createdAt": new Date(),
				"plays": 0,
				"videoId": video_object.video_id,
				"thumbail": video_object.thumbnail_url,
				"avg_rating": video_object.avg_rating,
				"title": title,
				"artist": artist,
				"length": video_object.length_seconds,
				"location": Session.get('musicUrl_tmp')
			};

			//console.log(music_info);

			Meteor.call('insertMusic', music_info);
			//Session.set('musicUrl', musicFileName);

			var audioWrapper = document.getElementById("musicPlayerWrapper");
			audioWrapper.innerHTML = "";

			audioWrapper.innerHTML = '<audio autoplay="autoplay" class="musicPlayer"><source src="'+this.location+'" /></audio>';

			audio = document.getElementsByTagName("audio");
	
		    /****************/
		    audio[0].load();//suspends and restores all audio element

		    //audio[0].play(); changed based on Sprachprofi's comment below
		    audio.oncanplaythrough = audio[0].play();
		    /****************/

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

