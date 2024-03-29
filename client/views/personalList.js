Template.personalList.helpers({
	'hasMusic': function(){
		if(Meteor.music.find({"userId": Meteor.userId()}).count() > 0){
			return true;
		}
		else return false;
	},
	'musicCount': function(){
		return Meteor.music.find({"userId": Meteor.userId()}).count();
	},
	'musicListPersonal': function(){
		return Meteor.music.find().fetch({"userId": Meteor.userId()});
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

Template.personalList.events({
	'click .applink-playMusicPersonal': function(e){

		Session.set('musicUrl', this.location);
		Session.set('musicTitle', this.title);
		Session.set('playerTitle', this.artist + " - " + this.title);
		Session.set('playerThumbnail', this.thumbnail);
		Session.set('isPlaying', true);
		Session.set('hidePlayer', false);

		$('#musicPlayer').trigger('stop');

		$('#musicPlayer').trigger('load', this.location);

		// $('#musicPlayerWrapper').html('<audio src="'+this.location+'" preload="auto" autoplay="autoplay" class="musicPlayer" id="musicPlayer"></audio>');
		
		$('#musicPlayer').trigger('play');

		Session.set('hidePlayer', false);
		Session.set('isPlaying', true);

	},
	'click .applink-pauseMusicPersonal': function(){
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

Template.personalList.rendered = function () {

};
