Template.playlists.helpers({
	'hasPlaylists': function(){
		if(playlists.find().count() > 0){
			return true;
		}
		else return false;
	},
	'playlistCount': function(){
		return playlists.find().count();
	},
	'ownPlaylistCount': function(){
		return playlists.find({userId: Meteor.userId()}).count();
	},
	'playlistList': function(){
		return playlists.find({}, {sort: {createdAt: -1}}).fetch();
	},
	'isOwnPlaylist': function(){
		if(this.userId == Meteor.userId()){
			return true;
		}
		else return false;
	},
	'playlistMusicCount': function(){
		return playlistTracks.find({playlist: this._id}).count();
	}
});

Template.playlists.events({
	'click .applink-openPlaylist': function(){
		console.log("Open Playlist " + this._id + ".");
		Router.go('playlist', {_id: this._id});
	}
});

Template.playlists.rendered = function () {
	$('.parallax').parallax();
	$('.tooltipped').tooltip({delay: 50});
};