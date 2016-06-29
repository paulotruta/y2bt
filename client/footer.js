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
		Session.set('musicUrl', '');
		Session.set('playerThumbnail', null);
		Session.set('playerTitle', '');
		var player = document.getElementsByTagName("audio")[0];
		player.removeAttribute("src");
		player.load();
		Sessio.set('hidePlayer', true);

	},
	'click .applink-skipMusic': function(){

		Session.set('isPlaying', true);

	}
});

Template.footer.rendered = function () {
	
};

