Template.footer.helpers({
	'hidePlayer': function(){
		return Session.get('hidePlayer');
	},
	'music_isPlaying': function(){
		return Session.get('isPlaying');
	},
	'music_title': function(){
		return Session.get('playerTitle');
	},
	'music_thumbnail': function(){
		return Session.get('playerThumbnail');
	},
	'music_url': function(){
		return Session.get('musicUrl');
	},
	'footerClasses': function(){
		if(is.mobile()){
			return 'page-footer';
		}

		return 'alternative-page-footer';

	}
});

Template.footer.events({
	'click .applink-playMusic': function(){
		Session.set('isPlaying', true);
		var player = document.getElementsByTagName("audio")[0];
		player.play();
	},
	'click .applink-pauseMusic': function(){

		Session.set('isPlaying', false);
		var player = document.getElementsByTagName("audio")[0];
		player.pause();

	},
	'click .applink-stopMusic': function(){

		Session.set('isPlaying', false);
		var player = document.getElementsByTagName("audio")[0];
		player.pause();
		player.currentTime = 0;

	},
	'click .applink-skipMusic': function(){

		console.log('Skipping track! Loading next...');
		var tracklist = Session.get('next_tracklist');
		var next_track = "";

		// Check if there is any track in queue...
		if(queueCollection.find().count() > 0){
			// Load the next track...
			var next_track_obj = queueCollection.find().fetch()[0];
			next_track = next_track_obj.location;
			// Remove it from queue;
			queueCollection.remove(next_track_obj._id);
		}
		else{
			// An example where the asynchronous way of Meteor working brings problems... 
			//var tracklist = Session.get('next_tracklist');
			next_track = tracklist.shift();
		}
		
		Session.set('musicUrl', next_track);
		Session.set('isPlaying', true);
		Session.set('next_tracklist', tracklist);
  		//$('#musicPlayerWrapper').html('<audio src="'+next_track+'" preload="auto" autoplay="autoplay" class="musicPlayer" id="musicPlayer"></audio>');
		$('#musicPlayer').trigger('load', next_track);
		$('#musicPlayer').trigger('play');
		var next_music_info = music.findOne({location: next_track});
		console.log(next_music_info);
		Meteor.call('incrementPlayCount', next_music_info._id);
		Session.set('musicTitle', next_music_info.title);
		Session.set('playerTitle', next_music_info.artist + " - " + next_music_info.title);
		Session.set('playerThumbnail', next_music_info.thumbnail);

	},
	'click .applink-openQueue': function(){

  		$('#queueList').openModal();
          
	},
	'pause .musicPlayer' : function(){
		var player = document.getElementsByTagName("audio")[0];
		Session.set('isPlaying', !player.paused);
	},
	'ended .musicPlayer': function(){

		console.log('Track ended! Loading next...');
		var tracklist = Session.get('next_tracklist');
		var next_track = "";

		// Check if there is any track in queue...
		if(queueCollection.find().count() > 0){
			// Load the next track...
			var next_track_obj = queueCollection.find().fetch()[0];
			next_track = next_track_obj.location;
			// Remove it from queue;
			queueCollection.remove(next_track_obj._id);
		}
		else{
			next_track = tracklist.shift();
		}
		
		Session.set('isPlaying', true);
		Session.set('musicUrl', next_track);
		Session.set('next_tracklist', tracklist);
		$('#musicPlayer').trigger('load', next_track);
  		//$('#musicPlayerWrapper').html('<audio src="'+next_track+'" preload="auto" autoplay="autoplay" class="musicPlayer" id="musicPlayer"></audio>');
		$('#musicPlayer').trigger('play');
		var next_music_info = music.findOne({location: next_track});
		console.log(next_music_info);
		Session.set('musicTitle', next_music_info.title);
		Session.set('playerTitle', next_music_info.artist + " - " + next_music_info.title);
		Session.set('playerThumbnail', next_music_info.thumbnail);
	}
});

Template.footer.rendered = function () {
	// audiojs.events.ready(function() {
 //    	var as = audiojs.createAll({

 //    	});
 //  	});
};

