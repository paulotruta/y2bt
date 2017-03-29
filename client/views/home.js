Template.home.helpers({
	'homeHelperExample1': function(){

	},
});
Template.home.events({
	'click .applink-searchMusic': function(e){

		var searchTerm = $('#search').val();

		Session.set('searchTerm', searchTerm);

		Meteor.call('searchMusic', searchTerm, function(err, result){

			console.log('Searching youtube for ' + searchTerm);
			Session.set('searchResults', result.items);
			console.log(result);

		});

		Router.go('/search');

	},
});

Template.home.rendered = function () {
	$('.slider').slider({
		full_width: true,
		indicators: false,
		height: 250,
		interval: 3000
	});

	// pause after 3 seconds...
		Meteor.setTimeout(function(){ $('.slider').slider('pause'); }, 5000);

};