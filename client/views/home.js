Template.home.helpers({
	'featuredArtists': function(){
		// var sample = Meteor.music.find({}, {}, 0, 10).fetch();
		// /**
		//  * Randomize array element order in-place.
		//  * Using Durstenfeld shuffle algorithm.
		//  */
		// function shuffleArray(array) {
		//     for (var i = array.length - 1; i > 0; i--) {
		//         var j = Math.floor(Math.random() * (i + 1));
		//         var temp = array[i];
		//         array[i] = array[j];
		//         array[j] = temp;
		//     }
		//     return array;
		// }

		// sample = shuffleArray(sample);

		// console.log(sample);

		

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