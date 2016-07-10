Session.set('isPlaying', false);
Session.set('hidePlayer', true);

Template.main.helpers({
	'music_isPlaying': function(){
		return Session.get('isPlaying');
	},
	'music_title': function(){
		return Session.get('playerTitle');
	}
});