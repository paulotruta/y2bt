Template.private.helpers({
	'hasMusic': function(){
		if(music.find().count() > 0){
			return true;
		}
		else return false;
	},
	'musicCount': function(){
		return music.find().count();
	},
	'musicList': function(){
		return music.find({}, {sort: {createdAt: -1}}).fetch();
	},
	'readableTime': function(seconds){
		var date = new Date(null);
		date.setSeconds(seconds);

		var minute_left0 = "";
		var second_left0 = "";

		if(date.getUTCMinutes() < 10){
			minute_left0 = "0";
		}

		if(date.getUTCSeconds() < 10){
			second_left0 = "0";
		}

		var time = minute_left0 + date.getUTCMinutes() + ":" + second_left0 + date.getUTCSeconds();
		return time;
	},
	'isPlaying': function(location){
		if(location && Session.get('isPlaying')){
			if(Session.get('musicUrl') == location) return true;
			else return false;
		} else {
			if(Session.get('isPlaying')) return true;
		}

		return false;
	}
});

Template.private.events({
	'click .applink-playMusic': function(e){

		Session.set('musicUrl', this.location);
		Session.set('musicTitle', this.title);
		Session.set('playerTitle', this.artist + " - " + this.title);
		Session.set('playerThumbnail', this.thumbnail);
		Session.set('hidePlayer', false);

		$('#musicPlayer').trigger('stop');

		$('#musicPlayer').trigger('load', this.location);

		//$('#musicPlayerWrapper').html('<audio src="'+this.location+'" preload="auto" autoplay="autoplay" class="musicPlayer" id="musicPlayer"></audio>');
		
		$('#musicPlayer').trigger('play');

		Session.set('hidePlayer', false);
		Session.set('isPlaying', true);

		// Set the next continuous play songs
		var selector = '.' + this._id;
		var next_tracks = $(selector).nextAll().map(function(){
			var track_location = $(this).attr('data-src');
			//console.log(track_location);
			return track_location;
		});
		// if(next_tracks.length == 0){
		// 	next_tracks = $('.collection').children().map(function(){
		// 		var track_location = $(this).attr('data-src');
		// 		x//console.log(track_location);
		// 		return track_location;
		// 	});
		// }
		
		//console.log(next_tracks);

		//Increment play count
		Meteor.call('incrementPlayCount', this._id);

		Session.set('next_tracklist', next_tracks.get());

	},
	'click .applink-pauseMusic': function(){
		Session.set('isPlaying', false);
		//Session.set('hidePlayer', false);
		var player = document.getElementsByTagName("audio")[0];
		player.pause();
	},
	'click .applink-queueMusic': function(){
		// Put this music in the queue...
		queueCollection.insert(this);
		Materialize.toast('Music added to the queue!', 4000);
	}
});

Template.private.rendered = function () {
	$('.tooltipped').tooltip({delay: 50});
};
