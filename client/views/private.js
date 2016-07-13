Template.private.helpers({
	'hasMusic': function(){
		if(Meteor.music.find().count() > 0){
			return true;
		}
		else return false;
	},
	'musicCount': function(){
		return Meteor.music.find().count();
	},
	'musicList': function(){
		return Meteor.music.find({}, {sort: {createdAt: -1}}).fetch();
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
		Session.set('isPlaying', true);
		Session.set('hidePlayer', false);

		$('#musicPlayer').trigger('stop');

		$('#musicPlayer').trigger('load', this.location);

		//$('#musicPlayerWrapper').html('<audio src="'+this.location+'" preload="auto" autoplay="autoplay" class="musicPlayer" id="musicPlayer"></audio>');
		
		$('#musicPlayer').trigger('play');

		Session.set('hidePlayer', false);
		Session.set('isPlaying', true);

	},
	'click .applink-pauseMusic': function(){
		Session.set('isPlaying', false);
		//Session.set('hidePlayer', false);
		var player = document.getElementsByTagName("audio")[0];
		player.pause();
	}
});

Template.private.rendered = function () {
	$('.tooltipped').tooltip({delay: 50});
};
