Template.queue.helpers({
	'hasMusic': function(){
		if(queueCollection.find().count() > 0){
			return true;
		}
		else return false;
	},
	'musicCount': function(){
		return queueCollection.find().count();
	},
	'queueList': function(){
		return queueCollection.find().fetch();
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

Template.queue.events({
	'click .applink-playMusicQueue': function(e){

		Session.set('musicUrl', this.location);
		Session.set('musicTitle', this.title);
		Session.set('playerTitle', this.artist + " - " + this.title);
		Session.set('playerThumbnail', this.thumbnail);
		Session.set('hidePlayer', false);

		$('#musicPlayer').trigger('stop');

		$('#musicPlayer').trigger('load', this.location);

		$('#musicPlayer').trigger('play');

		Session.set('hidePlayer', false);
		Session.set('isPlaying', true);
		// Increment play count
		Meteor.call('incrementPlayCount', this._id);

		// Remove from queue...
		queueCollection.remove(this._id);

	}
});

Template.queue.rendered = function () {

};
