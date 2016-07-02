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

		Session.set('isPlaying', true);

	}
});

Template.footer.rendered = function () {
	
	$("#player").bind('ended', function(){
    	// done playing
    	alert("Player stopped");
	});
};

