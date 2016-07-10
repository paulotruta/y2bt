Template.search.helpers({
	'searchHelperExample1': function(){

	},
	'searchResults': function(){
		return Session.get('searchResults');
	},
	'searchTerm': function(){
		return Session.get('searchTerm');
	}
});
Template.search.events({
	'click .applink-searchMusic': function(e){
		
		var searchTerm = $('#searchBar').val();

		Session.set('searchTerm', searchTerm);

		Meteor.call('searchMusic', searchTerm, function(err, result){

			Session.set('searchResults', result.items);
			console.log(result);

		});

	},
	'click .applink-addResult': function(){

		var video_id = this.id.videoId;

		console.log('Video ID: ' + video_id);

		Session.set('fromSearch', true);
		Session.set('fromSearchUrl', 'youtube.com/watch?v=' + video_id);
		Router.go('add');

	}
});

Template.search.rendered = function () {

	
};