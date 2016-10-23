Template.filteredList.helpers({
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
	},
	'toPlaylistTitle': function(){
		return Session.get('toPlaylistTitle');
	},
	'toPlaylistArtist': function(){
		return Session.get('toPlaylistArtist');
	},
	'toPlaylistLength': function(){
		return Session.get('toPlaylistLength');
	},
	'toPlaylistThumbnail': function(){
		return Session.get('toPlaylistThumbnail');
	},
	'creatingNewPlaylist': function(){
		return Session.get('creatingNewPlaylist');
	},
	'playlistList': function(){
		return playlists.find({userId: Meteor.userId()});
	},
	'playlistCount': function(){
		return playlists.find({userId: Meteor.userId()}).count();
	},
	'currentOrder': function(){
		if (typeof(Session.get('trackOrder')) == 'undefined'){
			return 'Most played';
		}
		return Session.get('trackOrder');
	},
	'currentFilter': function(){
		if(typeof(Session.get('trackFilter')) == 'undefined'){
			return 'Tracks from everyone';
		}

		return Session.get('trackFilter');
	},
	'filterLabel': function(label_name){
		var label = label_name;
		var current_label = Session.get('trackFilter');
		if(label_name == Session.get('trackFilter')){
			label += ' ✓';
		}

		return label;
	},
	'orderLabel': function(label_name){
		var current_label = Session.get('trackOrder');
		var label = label_name;
		if(label_name == Session.get('trackOrder')){
			label += ' ✓';
		}

		return label;
	},
});

Template.filteredList.events({
	'click .applink-playMusic': function(e){

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

		// Set the next continuous play songs
		var selector = '.' + this._id;
		var next_tracks = $(selector).nextAll().map(function(){
			var track_location = $(this).attr('data-src');
			//console.log(track_location);
			return track_location;
		});
		

		// Increment play count
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
	},
	'click .applink-addToPlaylist': function(){

		if(playlists.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}).count() < 1){
			// If the user does not have any playlist yet, redirect him to the new creation view (reactive session var)
			Session.set('creatingNewPlaylist', true);
		}

		Session.set('toPlaylistTitle', this.title);
		Session.set('toPlaylistArtist', this.artist);
		Session.set('toPlaylistThumbnail', this.thumbnail);
		Session.set('toPlaylistLength', this.length);
		Session.set('toPlaylistTrackId', this._id);

  		$('#modal1').openModal();
	},
	'click .applink-confirmPlaylist': function(){

		var result = Meteor.call('addToPlaylist', this._id, music.findOne({_id: Session.get('toPlaylistTrackId')}), function(err, result){
			if(result){
				Materialize.toast('Track added to playlist!', 4000);
			}
			else{
				Materialize.toast('Track is already on the playlist!', 4000);
			}
		});

		$('#modal1').closeModal();

	},
	'click .applink-createPlaylist': function(){

		if(!Session.get('creatingNewPlaylist')){
			// If we are not already viewing the creating screen, set the reactive variable.
			Session.set('creatingNewPlaylist', true);
		}else{
			// Just crunch the new data and insert into the collection...
			var newPlaylistName = $('#playlist_name').val();
			var newPlaylistDescription = $('#playlist_description').val();

			console.log('Playlist name: ' + newPlaylistName);
			console.log('Playlist description: ' + newPlaylistDescription);

			var playlistObject = {
				'name': newPlaylistName,
				'description': newPlaylistDescription,
				'cover': 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-410665.jpg',
				'userId': Meteor.userId()
			}

			Meteor.call('createPlaylist', playlistObject, music.findOne({_id: Session.get('toPlaylistTrackId')}));

			Materialize.toast('Playlist created!', 4000);
		}

	},
	'click .applink-toPlaylistBack': function(){
		Session.set('creatingNewPlaylist', false);
	},
	'click applink-closeCreatePlaylist': function(){
		$('#modal1').closeModal();
	},
	'click .applink-chooseFilter': function(e){
		Session.set('collectionLimit', 40);
		console.log("Changed track filter to " + e.currentTarget.dataset.trackfilter);
		console.log(e.currentTarget.dataset);
		Session.set('trackFilter', e.currentTarget.dataset.trackfilter);
		//document.location.reload(true);
		Router.rerun;
	},
	'click .applink-chooseOrder': function(e){
		Session.set('collectionLimit', 40);
		console.log("Changed track order to " + e.currentTarget.dataset.trackorder);
		console.log(e.currentTarget.dataset);
		Session.set('trackOrder', e.currentTarget.dataset.trackorder);
        //document.location.reload(true);
        Router.rerun;
	},
	'click .applink-loadMoreTracks': function(){
		console.log("Loading 80 more tracks...");
		var current_collection_limit = Session.get('collectionLimit');
		if(typeof(current_collection_limit) == 'undefined'){
			current_collection_limit = 40;
		}
		else{
			current_collection_limit += 40;
		}

		Session.set('collectionLimit', current_collection_limit);

		console.log("Current collection visible limit: " + current_collection_limit);
		Router.rerun;
	},
	'click .applink-trackOptionsTrigger': function(e){

		console.log("Triggering options for app");

		var track_id = e.currentTarget.dataset.id;
		var options_selector = '#options-' + track_id;
		console.log(options_selector);
		var trigger_selector = '#optionsTrigger-' + track_id;
		console.log(trigger_selector)


		$(trigger_selector).fadeOut('fast');
		$(options_selector).fadeIn();

		console.log($(trigger_selector));

		window.setTimeout(function() {
			$(options_selector).fadeOut('fast');
			$(trigger_selector).fadeIn();
		}, 5000);

	}

});

Template.filteredList.rendered = function () {
	if(typeof(Session.get('collectionLimit')) == 'undefined'){
		console.log('Setting default collection visible limit of 40 tracks');
	}
	
	$('.parallax').parallax();
	$('.tooltipped').tooltip({delay: 50});
	window.setTimeout(function() {
		console.log("Activating filtering dropdowns");
		$('.orderBtn').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrain_width: true, // Does not change width of dropdown to that of the activator
			hover: false, // Activate on hover
			gutter: 0, // Spacing from edge
			belowOrigin: true, // Displays dropdown below the button
			alignment: 'center' // Displays dropdown with edge aligned to the left of button
		});
		$('.filterBtn').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrain_width: true, // Does not change width of dropdown to that of the activator
			hover: false, // Activate on hover
			gutter: 0, // Spacing from edge
			belowOrigin: true, // Displays dropdown below the button
			alignment: 'center' // Displays dropdown with edge aligned to the left of button
		});
	}, 3000);
};
